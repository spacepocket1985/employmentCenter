import { Request, Response } from 'express';
import { foodMenuService } from '../services/foodMenu.service';
import {
  TFoodMenuPeriodResponse,
  TFoodMenuByDateResponse,
} from '../types/foodMenu.types';
import { IApiResponse } from '../types/menu.types';
import { MenuModel } from '../models/menu.model';

export class FoodMenuController {
  async getCurrentWeekMenu(req: Request, res: Response): Promise<void> {
    try {
      const data = await foodMenuService.getCurrentWeekMenu();

      const response: IApiResponse<TFoodMenuPeriodResponse> = {
        success: true,
        message: 'Меню на текущую неделю успешно получено',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в FoodMenuController.getCurrentWeekMenu:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить меню на текущую неделю',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  async getFullWeekMenu(req: Request, res: Response): Promise<void> {
    try {
      const data = await foodMenuService.getFullWeekMenu();

      const response: IApiResponse<TFoodMenuPeriodResponse> = {
        success: true,
        message:
          'Меню с понедельника по следующий понедельник успешно получено',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в FoodMenuController.getFullWeekMenu:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message:
          'Не удалось получить меню с понедельника по следующий понедельник',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  async getMenuByDate(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;

      if (!date || typeof date !== 'string') {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Параметр date обязателен',
          errors: ['Укажите дату в формате ДД.ММ.ГГ или ДД.ММ.ГГГГ'],
        };
        res.status(400).json(response);
        return;
      }

      const data = await foodMenuService.getMenuByDate(date);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: `Меню на ${date} не найдено`,
          errors: [`Нет данных на ${date}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<TFoodMenuByDateResponse> = {
        success: true,
        message: `Меню на ${date} успешно получено`,
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка в FoodMenuController.getMenuByDate:', errorMessage);

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить меню на указанную дату',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  async getMenuStatus(req: Request, res: Response): Promise<void> {
    try {
      const allMenus = await MenuModel.getFullMenu();

      const dates = allMenus.map((m) => m.date);
      const dishesCount = allMenus.reduce((sum, m) => sum + m.dishes.length, 0);

      const lastUpdated =
        allMenus.length > 0 ? allMenus[allMenus.length - 1].updatedAt : null;

      const data = {
        daysCount: allMenus.length,
        dishesCount,
        dates,
        lastUpdated,
      };

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Статус меню успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('Ошибка в FoodMenuController.getMenuStatus:', errorMessage);

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить статус меню',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }
}

export const foodMenuController = new FoodMenuController();
