import { Document, Model } from "mongoose";

// ========== ТИП КАТЕГОРИИ ==========
export type TDishCategory =
  | "dairy" // Творог, молочные, затирка
  | "drinks" // Напитки
  | "soups" // Супы
  | "sides" // Гарниры
  | "salads" // Салаты
  | "meat" // Мясо (говядина, свинина, печень, сердце, плов)
  | "fish" // Рыба
  | "poultry" // Птица
  | "culinary" // КУЛИНАРИЯ (объединяет выпечку, десерты, кондитерку)
  | "other"; // Другое

/**
 * Блюдо в меню (MongoDB)
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
  source?: "csv" | "1c";

  // ========== ПОЛЯ ДЛЯ КАТЕГОРИЗАЦИИ ИЗ 1С ==========
  /**
   * ID родительской папки из справочника 1С (SC3172.DBF)
   * Используется для точной категоризации блюд
   * Примеры: '1HQ' (холодные), '1HS' (горячие), '1HR' (супы)
   */
  parentId?: string;
  /**
   * Код подкатегории из 1С (SP4618)
   * Используется вместе с parentId для точной категоризации
   * Примеры: '4' (салаты), '5' (супы), '6' (гарниры)
   */
  sp4618?: string;

  /** Категория блюда для сортировки и фильтрации */
  category?: TDishCategory;
  /** Флаг "Выбор шефа" (рандомно, сохраняется в БД) */
  isChefRecommend?: boolean;
}

/**
 * Меню на один день (MongoDB)
 */
export interface IDayMenu {
  date: string;
  dayOfWeek: string;
  dishes: IDish[];
}

// MongoDB документ
export interface IMenuDocument extends IDayMenu, Document {
  createdAt: Date;
  updatedAt: Date;
}

// MongoDB модель
export interface IMenuModel extends Model<IMenuDocument> {
  clearAll(): Promise<{ deletedCount: number }>;
  getFullMenu(): Promise<IMenuDocument[]>;
  getByDate(date: string): Promise<IMenuDocument | null>;
  getByPeriod(dateFrom: string, dateTo: string): Promise<IMenuDocument[]>;
}

export type TMenu = IMenuDocument[];

// === CSV типы ===
export interface ICSVRow {
  0?: string;
  1?: string;
  2?: string;
  3?: string;
}

export interface ICSVValidationResult {
  isValid: boolean;
  errors: string[];
  parsedData: IDayMenu[] | null;
}

// === API типы ===
export interface IBaseApiResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

export interface IApiResponse<T = unknown> extends IBaseApiResponse {
  data?: T;
}

export interface IMenuStatusData {
  daysCount: number;
  dishesCount: number;
  dates: string[];
  lastUpdated: Date | null;
}

export interface IUploadResultData {
  daysCount: number;
  dishesCount: number;
}

export interface IClearResultData {
  deletedCount: number;
}
