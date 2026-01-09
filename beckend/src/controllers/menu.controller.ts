import { Request, Response } from 'express';
import { MenuModel } from '../models/menu.model';
import { CSVParser } from '../utils/csvParser';
import {
  IApiResponse,
  TMenu,
  IMenuStatusData,
  IUploadResultData,
  IClearResultData,
  IDayMenu,
  IMenuDocument,
} from '../types/menu.types';

export class MenuController {
  static async getMenu(
    req: Request,
    res: Response<IApiResponse<TMenu>>
  ): Promise<void> {
    try {
      const menu = await MenuModel.getFullMenu();

      const response: IApiResponse<TMenu> = {
        success: true,
        message: 'Меню успешно получено',
        data: menu,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Ошибка при получении меню:', error);

      const response: IApiResponse<never> = {
        success: false,
        message: 'Ошибка при получении меню',
        errors: [(error as Error).message],
      };

      res.status(500).json(response);
    }
  }

  static async uploadMenu(
    req: Request,
    res: Response<IApiResponse<IUploadResultData>>
  ): Promise<void> {
    try {
      if (!req.file) {
        const response: IApiResponse<IUploadResultData> = {
          success: false,
          message: 'CSV файл не загружен',
          errors: ['Файл не найден'],
        };

        res.status(400).json(response);
        return;
      }

      const csvText = req.file.buffer.toString('utf-8');
      const rows = CSVParser.csvTextToRows(csvText);
      const validationResult = CSVParser.parseCSV(rows);

      if (!validationResult.isValid || !validationResult.parsedData) {
        const response: IApiResponse<IUploadResultData> = {
          success: false,
          message: 'Ошибка валидации CSV файла',
          errors: validationResult.errors,
        };

        res.status(400).json(response);
        return;
      }

      // Удаляем старое меню
      await MenuModel.deleteMany({});

      // Сохраняем новое меню
      const menuData: IDayMenu[] = validationResult.parsedData;
      const savedDays: IMenuDocument[] = [];

      // Явное указание типа для каждого элемента
      for (const day of menuData) {
        const menuDoc = new MenuModel(day);
        const savedDay = await menuDoc.save();
        savedDays.push(savedDay);
      }

      const totalDishes = menuData.reduce(
        (sum, day) => sum + day.dishes.length,
        0
      );

      const response: IApiResponse<IUploadResultData> = {
        success: true,
        message: `Меню успешно загружено. Дней: ${savedDays.length}, блюд: ${totalDishes}`,
        data: {
          daysCount: savedDays.length,
          dishesCount: totalDishes,
        },
      };

      res.status(201).json(response);
    } catch (error) {
      console.error('Ошибка при загрузке меню:', error);

      const response: IApiResponse<IUploadResultData> = {
        success: false,
        message: 'Ошибка при загрузке меню',
        errors: [(error as Error).message],
      };

      res.status(500).json(response);
    }
  }

  static async clearMenu(
    req: Request,
    res: Response<IApiResponse<IClearResultData>>
  ): Promise<void> {
    try {
      const result = await MenuModel.clearAll();

      const response: IApiResponse<IClearResultData> = {
        success: true,
        message: `Меню успешно очищено. Удалено записей: ${result.deletedCount}`,
        data: result,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Ошибка при очистке меню:', error);

      const response: IApiResponse<never> = {
        success: false,
        message: 'Ошибка при очистке меню',
        errors: [(error as Error).message],
      };

      res.status(500).json(response);
    }
  }

  static async getMenuStatus(
    req: Request,
    res: Response<IApiResponse<IMenuStatusData>>
  ): Promise<void> {
    try {
      const menu = await MenuModel.getFullMenu();
      const totalDishes = menu.reduce((sum, day) => sum + day.dishes.length, 0);

      const lastUpdated =
        menu.length > 0
          ? new Date(
              Math.max(...menu.map((d) => new Date(d.updatedAt).getTime()))
            )
          : null;

      const response: IApiResponse<IMenuStatusData> = {
        success: true,
        message: 'Статус меню получен',
        data: {
          daysCount: menu.length,
          dishesCount: totalDishes,
          dates: menu.map((day) => day.date),
          lastUpdated: lastUpdated,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Ошибка при получении статуса меню:', error);

      const response: IApiResponse<never> = {
        success: false,
        message: 'Ошибка при получении статуса меню',
        errors: [(error as Error).message],
      };

      res.status(500).json(response);
    }
  }
}
