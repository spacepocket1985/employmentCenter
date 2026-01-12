//export const BaseUrl = 'http://localhost:5000/';
export const BaseUrl = 'http://10.182.1.143:5000/';

import {
  ApiResponse,
  Menu,
  MenuStatus,
  UploadResult,
  ClearResult,
} from '../types/menu.types';

// Вспомогательная функция для запросов
async function request<T = unknown>(
  endpoint: string,
  method: string = 'GET',
  body?: FormData
): Promise<ApiResponse<T>> {
  const url = `${BaseUrl}foodMenu${endpoint}`;

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

// Получить всё меню
export async function getMenu(): Promise<ApiResponse<Menu>> {
  return request<Menu>('');
}

// Получить статус меню
export async function getMenuStatus(): Promise<ApiResponse<MenuStatus>> {
  return request<MenuStatus>('/status');
}

// Загрузить CSV файл с меню
export async function uploadMenu(
  csvFile: File
): Promise<ApiResponse<UploadResult>> {
  const formData = new FormData();
  formData.append('csvFile', csvFile);

  return request<UploadResult>('/upload', 'POST', formData);
}

// Очистить всё меню
export async function clearMenu(): Promise<ApiResponse<ClearResult>> {
  return request<ClearResult>('/clear', 'DELETE');
}
