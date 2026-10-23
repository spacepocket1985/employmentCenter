// Описание: API функции для работы с сотрудниками
// Содержит запросы к бэкенду для получения списка мастеров

import {
  EmployeesApiResponse,
  EmployeeApiResponse,
  BirthdaysApiResponse,
  DepartmentsApiResponse,
} from '../types/employee.types';
import { request } from './baseRequest';
import {
  employeesEndpoint,
  mastersEndpoint,
  todayBirthdaysEndpoint,
  birthdaysEndpoint,
  departmentsEndpoint,
} from './endPoints';

/**
 * [НОВОЕ, internal] Собирает query-строку из объекта.
 * Отбрасывает undefined и пустые строки.
 * Возвращает строку БЕЗ ведущего '?' (или пустую строку, если нечего собирать).
 */
const buildQuery = (params: Record<string, string | undefined>): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      search.append(key, value);
    }
  });
  return search.toString();
};

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

// ============================================
// [НОВОЕ] Модуль дней рождения
// Существующие функции выше НЕ затронуты
// ============================================

/**
 * [НОВОЕ] Получение ближайших дней рождения (виджет /hb).
 * Используется после рефакторинга App.tsx вместо старого fetch-слоя.
 * GET /employees/hb
 */
export const fetchTodayBirthdays = (): Promise<EmployeesApiResponse> => {
  return request<EmployeesApiResponse>(todayBirthdaysEndpoint, {
    method: 'GET',
  });
};

/**
 * [НОВОЕ] Получение полного списка дней рождения с фильтрами.
 * GET /employees/birthdays?month=5&department=ЦОП&search=Иванов
 *
 * @param filters.month      - номер месяца 1..12
 * @param filters.department - точное название отдела
 * @param filters.search     - подстрока ФИО
 * @returns Promise с сотрудниками (с флагами isToday/isSoon) + справочник отделов
 */
export const fetchBirthdays = (filters?: {
  month?: string;
  department?: string;
  search?: string;
}): Promise<BirthdaysApiResponse> => {
  const qs = buildQuery({
    month: filters?.month,
    department: filters?.department,
    search: filters?.search,
  });
  const url = qs !== '' ? `${birthdaysEndpoint}?${qs}` : birthdaysEndpoint;
  return request<BirthdaysApiResponse>(url, { method: 'GET' });
};

/**
 * [НОВОЕ] Получение справочника отделов.
 * GET /employees/departments
 */
export const fetchDepartments = (): Promise<DepartmentsApiResponse> => {
  return request<DepartmentsApiResponse>(departmentsEndpoint, {
    method: 'GET',
  });
};
