// Description: Defines the data structure for filtering test sessions.

import { TestSessionTypeEnum } from './testSession.model';

/**
 * Модель фильтрации сессий тестов
 * Все поля опциональны — можно комбинировать
 */
export type TestSessionFilterModel = {
  /** ID сотрудника */
  employeeId?: string;
  /** ФИО сотрудника (поиск по вхождению) */
  employeeName?: string;
  /** Подразделение */
  employeeDepartment?: string;
  /** ID теста */
  testId?: string;
  /** Название мероприятия */
  eventName?: string;
  /** Дата мероприятия (от) */
  eventDateFrom?: string;
  /** Дата мероприятия (до) */
  eventDateTo?: string;
  /** Дата завершения (от) */
  completedAtFrom?: string;
  /** Дата завершения (до) */
  completedAtTo?: string;
  /** Тип сессии: registered | manual */
  sessionType?: TestSessionTypeEnum;
  /** Лимит записей (по умолчанию 100) */
  limit?: number;
  /** Смещение для пагинации */
  skip?: number;
  /** Сортировка: 'asc' | 'desc' (по completedAt) */
  sort?: 'asc' | 'desc';
};
