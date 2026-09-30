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