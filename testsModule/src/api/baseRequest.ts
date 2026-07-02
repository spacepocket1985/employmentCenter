// Описание: Базовая функция для HTTP запросов
// Поддерживает GET, POST, PUT, DELETE, PATCH с JSON телом

import { BaseUrl } from './baseUrl';
import type { HttpMethod } from '../types/types';

/**
 * Опции для запроса
 */
export type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown; // Любые данные, будут преобразованы в JSON
};

/**
 * Базовая функция для выполнения HTTP запросов
 * @template T - Тип ожидаемого ответа
 * @param endpoint - Эндпоинт (например, 'tests')
 * @param options - Опции запроса
 * @returns Promise с ответом типа T
 * 
 * @example
 * const tests = await request<TestsApiResponse>('tests', { method: 'GET' });
 * const result = await request<TestResultApiResponse>('tests/submit', { 
 *   method: 'POST', 
 *   body: submissionData 
 * });
 */
export async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;
  
  const url: string = `${BaseUrl}/${endpoint}`;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response: Response = await fetch(url, config);
    
    // Парсим ответ как JSON
    const data: T = await response.json();

    if (!response.ok) {
      // Если статус не OK, пробрасываем ошибку с сообщением от сервера
      const errorMessage: string = 
        (data as { msg?: string })?.msg || 
        `Ошибка ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      throw new Error(error.message || 'Ошибка сети');
    }
    
    throw new Error('Неизвестная ошибка');
  }
}