import { Document, Model } from 'mongoose';

export interface IDish {
  number: number;
  name: string;
  weight: string;
  price: number;
  originalPrice?: string;
}

export interface IDayMenu {
  date: string;
  dayOfWeek: string;
  dishes: IDish[];
}

// Интерфейс документа MongoDB
export interface IMenuDocument extends IDayMenu, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейс модели Mongoose
export interface IMenuModel extends Model<IMenuDocument> {
  clearAll(): Promise<{ deletedCount: number }>;
  getFullMenu(): Promise<IMenuDocument[]>;
}

export type TMenu = IMenuDocument[];

export interface ICSVRow {
  0?: string; // Дата или №
  1?: string; // Наименование
  2?: string; // Выход
  3?: string; // Цена
}

export interface ICSVValidationResult {
  isValid: boolean;
  errors: string[];
  parsedData: IDayMenu[] | null;
}

// Базовый интерфейс для ответа API
interface IBaseApiResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// Дженерик интерфейс для типизированных ответов
export interface IApiResponse<T = unknown> extends IBaseApiResponse {
  data?: T;
}

// Конкретные типы для разных ответов API
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