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
