import { ApiResponse, WorkPlan } from 'src/types/plan.types';

//export const BaseUrl = 'http://localhost:5000/';
export const BaseUrl = 'http://10.182.1.143:5000/';

// Вспомогательная функция для запросов
async function request<T = unknown>(
  endpoint: string,
  method: string = 'GET',
  body?: FormData
): Promise<ApiResponse<T>> {
  const url = `${BaseUrl}workPlans${endpoint}`;

  const config: RequestInit = {
    method,
  };

  if (body) {
    config.body = body;
  }

  try {
    const response = await fetch(url, config);
    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка сервера');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: (error as Error).message || 'Ошибка сети',
      errors: [(error as Error).message],
    };
  }
}

// Получить текущий план
export async function getCurrentPlan(): Promise<ApiResponse<WorkPlan>> {
  return request<WorkPlan>('/current');
}
