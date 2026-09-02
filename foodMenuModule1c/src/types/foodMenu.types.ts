/**
 * Ответ на запрос меню на один день (для API)
 */

export type TDishCategory =
  | 'dairy' // Творог, молочные, затирка
  | 'drinks' // Напитки
  | 'soups' // Супы
  | 'sides' // Гарниры
  | 'salads' // Салаты
  | 'meat' // Мясо (говядина, свинина, печень, сердце, плов)
  | 'fish' // Рыба
  | 'poultry' // Птица
  | 'baking' // Выпечка
  | 'desserts' // Десерты
  | 'other'; // Другое

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

  // ========== НОВЫЕ ПОЛЯ ==========
  /** Категория блюда для сортировки и фильтрации */
  category?: TDishCategory;
  /** Флаг "Выбор шефа" (рандомно, сохраняется в БД) */
  isChefRecommend?: boolean;
}

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
