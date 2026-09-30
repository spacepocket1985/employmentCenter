// Описание: API функции для работы с сотрудниками
// Содержит запросы к бэкенду для получения списка мастеров

import { request } from './baseRequest';
import { employeesEndpoint, mastersEndpoint } from './endPoints';
import type {
  EmployeesApiResponse,
  EmployeeApiResponse,
} from 'src/types/employee.types';

/**
 * Получение списка всех мастеров
 * GET /employees/masters
 * @returns Promise с списком мастеров
 */
export const fetchMasters = (): Promise<EmployeesApiResponse> => {
  return request<EmployeesApiResponse>(mastersEndpoint, {
    method: 'GET',
  });
};

/**
 * Получение сотрудника по ID
 * GET /employees/:id
 * @param id - ID сотрудника
 * @returns Promise с данными сотрудника
 */
export const fetchEmployeeById = (id: string): Promise<EmployeeApiResponse> => {
  return request<EmployeeApiResponse>(`${employeesEndpoint}/${id}`, {
    method: 'GET',
  });
};

/**
 * Поиск сотрудников по началу имени
 * GET /employees/search/:name
 * @param name - Начало имени
 * @returns Promise с списком сотрудников
 */
export const searchEmployeesByName = (
  name: string
): Promise<EmployeesApiResponse> => {
  return request<EmployeesApiResponse>(
    `${employeesEndpoint}/search/${encodeURIComponent(name)}`,
    { method: 'GET' }
  );
};
