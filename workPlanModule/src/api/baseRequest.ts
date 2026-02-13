import { BaseUrl } from './baseUrl';

// Вспомогательная функция для запросов
export async function request<T = unknown>(
  endpoint: string,
  method: string = 'GET',
  body?: FormData
): Promise<T> {
  const url = `${BaseUrl}/${endpoint}`;

  const config: RequestInit = {
    method,
  };

  if (body) {
    config.body = body;
  }

  try {
    const response = await fetch(url, config);
    const data: T = await response.json(); // Просто парсим JSON как T

    if (!response.ok) {
      // Если статус не OK, но сервер вернул ошибку в нашем формате
      throw new Error('Ошибка сервера');
    }

    return data; // Возвращаем сам ответ, не оборачивая в ApiResponse
  } catch (error) {
    console.error('API Error:', error);
    // Пробрасываем ошибку дальше, чтобы хук ее обработал
    throw new Error((error as Error).message || 'Ошибка сети');
  }
}
