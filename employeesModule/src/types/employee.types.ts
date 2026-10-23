// Описание: Типы для работы с сотрудниками

/**
 * Модель сотрудника (из БД)
 */
export type EmployeeType = {
  _id: string;
  name: string;
  job: string;
  department: string;
  birthday: string;
  groups?: string[];
  orderIndex?: number;
  responsibleOrder?: number;
  safetyOrder?: number;
  createdAt?: string;
  updatedAt?: string;
};

/**
 * Ответ API для списка сотрудников
 */
export type EmployeesApiResponse = {
  data: EmployeeType[];
  msg: string;
};

/**
 * Ответ API для одного сотрудника
 */
export type EmployeeApiResponse = {
  data: EmployeeType;
  msg: string;
};

// ============================================
// [НОВОЕ] Модуль дней рождения — полный список
// Существующие типы выше НЕ затронуты
// ============================================

/**
 * [НОВОЕ] Сотрудник с вычисленным статусом дня рождения.
 * Используется ТОЛЬКО для эндпоинта GET /employees/birthdays.
 * Флаги вычисляются на бэкенде.
 *
 * - isToday: день рождения сегодня
 * - isSoon:  день рождения в ближайшие 3 дня (сегодня, завтра, послезавтра)
 */
export type EmployeeBirthdayType = EmployeeType & {
  isToday: boolean;
  isSoon: boolean;
};

/**
 * [НОВОЕ] Ответ API для GET /employees/birthdays.
 * Помимо сотрудников отдаёт справочник отделов,
 * чтобы фронт не делал второй запрос при открытии модалки.
 */
export type BirthdaysApiResponse = {
  data: EmployeeBirthdayType[];
  departments: string[];
  msg: string;
};

/**
 * [НОВОЕ] Ответ API для GET /employees/departments.
 */
export type DepartmentsApiResponse = {
  data: string[];
  msg: string;
};
