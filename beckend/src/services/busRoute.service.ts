import { BusRoute } from '../models/busRoute.model';
import { BusRouteCreateModel } from '../models/busRouteCreateModel';
import { BusRouteUpdateModel } from '../models/busRouteUpdateModel';
import { BusRouteType, BusRouteResponse } from '../types/busRoute.types';
import { Types } from 'mongoose';
import { getErrorMessage } from '../utils/errorHandler';

class BusRouteService {
  /**
   * Преобразует документ MongoDB в ответ для клиента
   */
  private toResponse(busRoute: BusRouteType): BusRouteResponse {
    const { ...rest } = busRoute.toObject();
    return rest as BusRouteResponse;
  }

  /**
   * Преобразует массив документов в массив ответов
   */
  private toResponseArray(busRoutes: BusRouteType[]): BusRouteResponse[] {
    return busRoutes.map((route) => this.toResponse(route));
  }

  /**
   * Проверяет валидность MongoDB ID
   */
  private isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  async createBusRoute(
    busRouteData: BusRouteCreateModel
  ): Promise<BusRouteResponse> {
    try {
      // Добавляем isActive по умолчанию, если не указан
      const dataToCreate = {
        ...busRouteData,
        isActive: busRouteData.isActive ?? true,
      };

      const newBusRoute = await BusRoute.create(dataToCreate);
      return this.toResponse(newBusRoute);
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      // Проверяем на ошибку дубликата (уникальный номер маршрута)
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new Error(
          `Bus route with number ${busRouteData.routeNumber} already exists`
        );
      }

      throw new Error(`Failed to create bus route: ${message}`);
    }
  }

  async deleteBusRoute(id: string): Promise<BusRouteResponse | null> {
    try {
      if (!this.isValidObjectId(id)) {
        throw new Error('Invalid ID format');
      }

      const deletedBusRoute = await BusRoute.findByIdAndDelete(id);
      return deletedBusRoute ? this.toResponse(deletedBusRoute) : null;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to delete bus route: ${message}`);
    }
  }

  async getBusRoute(id: string): Promise<BusRouteResponse | null> {
    try {
      if (!this.isValidObjectId(id)) {
        throw new Error('Invalid ID format');
      }

      const busRoute = await BusRoute.findById(id);
      return busRoute ? this.toResponse(busRoute) : null;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to get bus route: ${message}`);
    }
  }

  async getAllBusRoutes(): Promise<BusRouteResponse[]> {
    try {
      const busRoutes = await BusRoute.find({}).sort('-createdAt');
      return this.toResponseArray(busRoutes);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to get bus routes: ${message}`);
    }
  }

  async getBusRoutesByNumber(routeNumber: string): Promise<BusRouteResponse[]> {
    try {
      const busRoutes = await BusRoute.find({
        routeNumber: routeNumber,
      }).sort('-createdAt');

      return this.toResponseArray(busRoutes);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to get bus routes by number: ${message}`);
    }
  }

  async getActiveBusRoutes(): Promise<BusRouteResponse[]> {
    try {
      const busRoutes = await BusRoute.find({
        isActive: true,
      }).sort('routeNumber');

      return this.toResponseArray(busRoutes);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to get active bus routes: ${message}`);
    }
  }

  async updateBusRoute(
    id: string,
    busRouteData: BusRouteUpdateModel
  ): Promise<BusRouteResponse | null> {
    try {
      if (!this.isValidObjectId(id)) {
        throw new Error('Invalid ID format');
      }

      // Если обновляем isActive, убеждаемся что это boolean
      const updateData = {
        ...busRouteData,
        ...(busRouteData.isActive !== undefined && {
          isActive: Boolean(busRouteData.isActive),
        }),
      };

      const updatedBusRoute = await BusRoute.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      return updatedBusRoute ? this.toResponse(updatedBusRoute) : null;
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      // Проверяем на ошибку дубликата при обновлении
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 11000
      ) {
        throw new Error(
          `Bus route with number ${busRouteData.routeNumber} already exists`
        );
      }

      throw new Error(`Failed to update bus route: ${message}`);
    }
  }

  async toggleBusRouteStatus(
    id: string,
    isActive: boolean
  ): Promise<BusRouteResponse | null> {
    try {
      if (!this.isValidObjectId(id)) {
        throw new Error('Invalid ID format');
      }

      const updatedBusRoute = await BusRoute.findByIdAndUpdate(
        id,
        { isActive },
        {
          new: true,
          runValidators: true,
        }
      );

      return updatedBusRoute ? this.toResponse(updatedBusRoute) : null;
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      throw new Error(`Failed to toggle bus route status: ${message}`);
    }
  }
}

export const busRouteService = new BusRouteService();
