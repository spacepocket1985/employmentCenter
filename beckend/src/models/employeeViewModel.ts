import { EmployeeType } from './employee.model';

/**
 * Базовая ViewModel для ответов API сотрудников.
 */
export type EmployeeViewModel<T> = {
  data?: T;
  msg: string;
};

/**
 * [НОВОЕ] Сотрудник с вычисленным статусом дня рождения.
 * Используется ТОЛЬКО в новом эндпоинте GET /employees/birthdays.
 *
 * - isToday: день рождения сегодня
 * - isSoon:  день рождения в ближайшие 3 дня (сегодня, завтра, послезавтра)
 */
export type EmployeeBirthdayView = EmployeeType & {
  isToday: boolean;
  isSoon: boolean;
};

/**
 * [НОВОЕ] ViewModel для эндпоинта GET /employees/birthdays.
 * Отдаёт сразу и список сотрудников, и справочник отделов,
 * чтобы фронт не делал два запроса при открытии модалки.
 */
export type BirthdayListViewModel = {
  data?: EmployeeBirthdayView[];
  departments?: string[];
  msg: string;
};