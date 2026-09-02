import { Request, Response } from 'express';
import { mealDealService } from '../services/mealDeal.service';
import { IApiResponse } from '../types/menu.types';

export class MealDealController {
  /**
   * GET /api/food-menu/meal-deal
   * Сбалансированный обед на сегодня
   * Query: ?date=01.09.26
   */
  async getBalancedMealDeal(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const data = await mealDealService.getBalancedMealDeal(date as string);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Меню не найдено',
          errors: [`Нет данных на ${date || 'сегодня'}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Сбалансированный обед успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в MealDealController.getBalancedMealDeal:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить сбалансированный обед',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/food-menu/meal-deal/random
   * Случайный обед (рефетч)
   * Query: ?date=01.09.26
   */
  async getRandomMealDeal(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const data = await mealDealService.getRandomMealDeal(date as string);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Меню не найдено',
          errors: [`Нет данных на ${date || 'сегодня'}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Случайный обед успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в MealDealController.getRandomMealDeal:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить случайный обед',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/food-menu/meal-deal/economy
   * Эконом обед (самые дешевые блюда)
   * Query: ?date=01.09.26
   */
  async getEconomyMealDeal(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const data = await mealDealService.getEconomyMealDeal(date as string);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Меню не найдено',
          errors: [`Нет данных на ${date || 'сегодня'}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Эконом обед успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в MealDealController.getEconomyMealDeal:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить эконом обед',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/food-menu/meal-deal/hearty
   * Сытный обед (самые большие порции)
   * Query: ?date=01.09.26
   */
  async getHeartyMealDeal(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const data = await mealDealService.getHeartyMealDeal(date as string);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Меню не найдено',
          errors: [`Нет данных на ${date || 'сегодня'}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Сытный обед успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в MealDealController.getHeartyMealDeal:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить сытный обед',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/food-menu/meal-deal/veggie
   * Вегетарианский обед
   * Query: ?date=01.09.26
   */
  async getVeggieMealDeal(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const data = await mealDealService.getVeggieMealDeal(date as string);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Меню не найдено',
          errors: [`Нет данных на ${date || 'сегодня'}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Вегетарианский обед успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в MealDealController.getVeggieMealDeal:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить вегетарианский обед',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }

  /**
   * GET /api/food-menu/meal-deal/fish
   * Рыбный обед
   * Query: ?date=01.09.26
   */
  async getFishMealDeal(req: Request, res: Response): Promise<void> {
    try {
      const { date } = req.query;
      const data = await mealDealService.getFishMealDeal(date as string);

      if (!data) {
        const response: IApiResponse<never> = {
          success: false,
          message: 'Меню не найдено',
          errors: [`Нет данных на ${date || 'сегодня'}`],
        };
        res.status(404).json(response);
        return;
      }

      const response: IApiResponse<typeof data> = {
        success: true,
        message: 'Рыбный обед успешно получен',
        data,
      };

      res.status(200).json(response);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error(
        'Ошибка в MealDealController.getFishMealDeal:',
        errorMessage
      );

      const response: IApiResponse<never> = {
        success: false,
        message: 'Не удалось получить рыбный обед',
        errors: [errorMessage],
      };

      res.status(500).json(response);
    }
  }
}

export const mealDealController = new MealDealController();
