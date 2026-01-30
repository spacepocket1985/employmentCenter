// src/types/schedule.types.ts

export type ScheduleType = 'responsibleOnWeekends' | 'safetyOfficers';

export type ScheduleFormData = {
  month: string; // Format: "2024-01"
  scheduleType: ScheduleType;
  entries: ScheduleEntryForm[];
};

export type ScheduleEntryForm = {
  id: string;
  employeeId?: string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
  isFromTemplate: boolean; // Флаг, что строка из шаблона
};

export type MonthOption = {
  value: string; // "2024-01"
  label: string; // "Январь 2024"
  year: number;
  month: number;
};

export type DateValidationResult = {
  isValid: boolean;
  error?: string;
};

export type ScheduleValidationErrors = {
  month?: string;
  scheduleType?: string;
  entries?: Record<string, string[]>; // key: entry id, value: array of errors
};

export type ScheduleEntry = {
  _id?: string;
  employeeId?: string; // Ссылка на сотрудника (если выбран из базы)
  customName?: string; // Ручной ввод имени (если не из базы)
  customJob?: string; // Ручной ввод должности (если не из базы)
  dates: string[]; // Даты в формате "2024-01-06"
  orderIndex: number; // Порядок в графике
  notes?: string; // Примечания к конкретной записи
};

export type ScheduleCreateModel = {
  month: string;
  scheduleType: 'responsibleOnWeekends' | 'safetyOfficers';
  entries: Omit<ScheduleEntry, '_id'>[];
  notes?: string;
};

export type ScheduleEntryCreateModel = Omit<ScheduleEntry, '_id'>;

export type ScheduleUpdateModel = {
  entries?: Omit<ScheduleEntry, '_id'>[];
  isPublished?: boolean;
  notes?: string;
};
