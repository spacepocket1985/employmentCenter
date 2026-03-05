import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';

import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithQuery,
} from '../types/types';
import { BusRouteCreateModel } from '../models/busRouteCreateModel';
import { BusRouteResponse } from '../types/busRoute.types';
import { busRouteService } from '../services/busRoute.service';
import { ViewModel } from '../models/viewModel';
import { BusRouteUpdateModel } from '../models/busRouteUpdateModel';
import { getErrorMessage } from '../utils/errorHandler';

// Типы для query параметров
type GetAllRoutesQuery = {
  active?: string;
  number?: string;
};

class BusRouteController {
  async createBusRoute(
    req: RequestWithBody<BusRouteCreateModel>,
    res: Response<ViewModel<BusRouteResponse>>
  ): Promise<void> {
    try {
      const newBusRoute = await busRouteService.createBusRoute(req.body);

      res.status(StatusCodes.CREATED).json({
        data: newBusRoute,
        msg: 'Bus route successfully created!',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      // Проверяем специфические ошибки
      if (message.includes('already exists')) {
        res.status(StatusCodes.CONFLICT).json({ msg: message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error creating bus route: ${message}` });
    }
  }

  async getAllBusRoutes(
    req: RequestWithQuery<GetAllRoutesQuery>,
    res: Response<ViewModel<BusRouteResponse[]>>
  ): Promise<void> {
    try {
      const { active, number } = req.query;

      let busRoutes: BusRouteResponse[];

      // Фильтрация по query параметрам
      if (number) {
        busRoutes = await busRouteService.getBusRoutesByNumber(number);
      } else if (active === 'true') {
        busRoutes = await busRouteService.getActiveBusRoutes();
      } else {
        busRoutes = await busRouteService.getAllBusRoutes();
      }

      res.status(StatusCodes.OK).json({
        data: busRoutes,
        msg: 'Bus routes have been fetched!',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error fetching bus routes: ${message}` });
    }
  }

  async getBusRoute(
    req: RequestWithParams<{ id: string }>,
    res: Response<ViewModel<BusRouteResponse>>
  ): Promise<void> {
    try {
      const { id } = req.params;

      const busRoute = await busRouteService.getBusRoute(id);

      if (!busRoute) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: 'Requested bus route not found!' });
        return;
      }

      res.status(StatusCodes.OK).json({
        data: busRoute,
        msg: 'Bus route fetched successfully',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      if (message.includes('Invalid ID format')) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error fetching bus route: ${message}` });
    }
  }

  async updateBusRoute(
    req: RequestWithParamsAndBody<{ id: string }, BusRouteUpdateModel>,
    res: Response<ViewModel<BusRouteResponse>>
  ): Promise<void> {
    try {
      const { id } = req.params;

      // Проверяем, что тело запроса не пустое
      if (Object.keys(req.body).length === 0) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'Update data cannot be empty!' });
        return;
      }

      const updatedBusRoute = await busRouteService.updateBusRoute(
        id,
        req.body
      );

      if (!updatedBusRoute) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: 'Requested bus route not found!' });
        return;
      }

      res.status(StatusCodes.OK).json({
        data: updatedBusRoute,
        msg: 'Bus route successfully updated!',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      if (message.includes('Invalid ID format')) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: message });
        return;
      }

      if (message.includes('already exists')) {
        res.status(StatusCodes.CONFLICT).json({ msg: message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error updating bus route: ${message}` });
    }
  }

  async deleteBusRoute(
    req: RequestWithParams<{ id: string }>,
    res: Response<ViewModel<BusRouteResponse>>
  ): Promise<void> {
    try {
      const { id } = req.params;

      const deletedBusRoute = await busRouteService.deleteBusRoute(id);

      if (!deletedBusRoute) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: 'Requested bus route not found!' });
        return;
      }

      res.status(StatusCodes.OK).json({
        data: deletedBusRoute,
        msg: 'Bus route successfully deleted!',
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      if (message.includes('Invalid ID format')) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error deleting bus route: ${message}` });
    }
  }

  async toggleBusRouteStatus(
    req: RequestWithParamsAndBody<{ id: string }, { isActive: boolean }>,
    res: Response<ViewModel<BusRouteResponse>>
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: 'isActive must be a boolean' });
        return;
      }

      const updatedBusRoute = await busRouteService.toggleBusRouteStatus(
        id,
        isActive
      );

      if (!updatedBusRoute) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ msg: 'Requested bus route not found!' });
        return;
      }

      res.status(StatusCodes.OK).json({
        data: updatedBusRoute,
        msg: `Bus route ${
          isActive ? 'activated' : 'deactivated'
        } successfully!`,
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      if (message.includes('Invalid ID format')) {
        res.status(StatusCodes.BAD_REQUEST).json({ msg: message });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ msg: `Error toggling bus route status: ${message}` });
    }
  }
}

export const busRouteController = new BusRouteController();
