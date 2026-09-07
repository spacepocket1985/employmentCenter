/**
 * Категории блюд для меню
 * 
 * ВНИМАНИЕ: 
 * - 'baking' и 'desserts' больше не используются
 * - Вместо них используется 'culinary' (объединяет выпечку и десерты)
 */
export type TDishCategory =
  | 'dairy'      // Молочные блюда (творог, сырники, запеканки)
  | 'drinks'     // Напитки (компот, чай, кофе, кисель)
  | 'soups'      // Супы (борщ, рассольник, окрошка)
  | 'sides'      // Гарниры (каши, пюре, макароны)
  | 'salads'     // Салаты (все виды салатов, винегрет)
  | 'meat'       // Мясные блюда (говядина, свинина, печень)
  | 'fish'       // Рыбные блюда (хек, скумбрия)
  | 'poultry'    // Блюда из птицы (курица, цыпленок)
  | 'culinary'   // КУЛИНАРИЯ (выпечка, десерты, кондитерка)
  | 'other';     // Другое

/**
 * Интерфейс блюда в меню
 */
export interface IDish {
  /** Порядковый номер блюда в меню дня */
  number: number;
  /** Название блюда */
  name: string;
  /** Выход (вес/объем) */
  weight: string;
  /** Цена */
  price: number;
  /** Оригинальная цена (из CSV) */
  originalPrice?: string;

  // Поля из 1С
  id1C?: string;
  code1C?: string;
  unit1C?: string;
  docDate?: string;
  docNumber?: string;
  source?: 'csv' | '1c';

  /** Категория блюда для сортировки и фильтрации */
  category?: TDishCategory;
  /** Флаг "Выбор шефа" (рандомно, сохраняется в БД) */
  isChefRecommend?: boolean;
}

/**
 * Ответ на запрос меню на один день (для API)
 */
export type TFoodMenuDayResponse = {
  date: string;
  dayOfWeek: string;
  dishes: IDish[];
  count?: number;
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