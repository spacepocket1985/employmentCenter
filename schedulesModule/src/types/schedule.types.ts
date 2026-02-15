/**
 * Тип графика дежурств
 */
export type ScheduleType = 'responsibleOnWeekends' | 'safetyOfficers';

export const ScheduleTypeEnum: Record<ScheduleType, ScheduleType> = {
  responsibleOnWeekends: 'responsibleOnWeekends',
  safetyOfficers: 'safetyOfficers',
} as const;

/**
 * ЗАПИСЬ ИЗ БД (как приходит с бэкенда)
 */
export type ScheduleEntryDb = {
  _id: string;
  employeeId?:
    | {
        _id: string;
        name: string;
        job: string;
        department: string;
      }
    | string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
  notes?: string;
};

/**
 * Модель графика из БД
 */
export type ScheduleModel = {
  _id: string;
  month: string;
  scheduleType: ScheduleType;
  entries: ScheduleEntryDb[];
  notes?: string;
  createdBy?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

export type SchedulesFromApi = {
  data: ScheduleModel[];
  msg: string;
};

/**
 * Состояние снекбара
 */
export type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};
