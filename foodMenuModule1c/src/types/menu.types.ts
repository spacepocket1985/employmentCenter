import { TFoodMenuDayResponse } from "./foodMenu.types";


// Базовый тип ответа от API
interface BaseApiResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// Типизированный ответ от API
export interface ApiResponse<T = unknown> extends BaseApiResponse {
  data?: T;
}

// Тип для результата валидации CSV
export interface CSVValidationResult {
  isValid: boolean;
  errors: string[];
  parsedData: TFoodMenuDayResponse[] | null;
}

// Тип для статуса меню
export interface MenuStatus {
  daysCount: number;
  dishesCount: number;
  dates: string[];
  lastUpdated: string | null;
}

// Тип для результата загрузки
export interface UploadResult {
  daysCount: number;
  dishesCount: number;
}

// Тип для результата очистки
export interface ClearResult {
  deletedCount: number;
}
