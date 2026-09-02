import { IDish } from './menu.types';

/**
 * Ответ на запрос меню на один день (для API)
 */
export type TFoodMenuDayResponse = {
  date: string;
  dayOfWeek: string;
  dishes: IDish[];
  count: number;
};

/**
 * Ответ на запрос меню за период (для API)
 */
export type TFoodMenuPeriodResponse = {
  period: {
    from: string;
    to: string;
  };
  days: TFoodMenuDayResponse[];
  totalDays: number;
  totalDishes: number;
};

/**
 * Ответ на запрос меню на конкретную дату (для API)
 */
export type TFoodMenuByDateResponse = {
  date: string;
  dayOfWeek: string;
  dishes: IDish[];
  count: number;
};
