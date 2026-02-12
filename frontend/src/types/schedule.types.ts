/**
 * Тип графика дежурств
 */
export type ScheduleType = 'responsibleOnWeekends' | 'safetyOfficers';

export const ScheduleTypeEnum: Record<ScheduleType, ScheduleType> = {
  responsibleOnWeekends: 'responsibleOnWeekends',
  safetyOfficers: 'safetyOfficers',
} as const;

/**
 * Опция месяца для выпадающего списка
 */
export type MonthOption = {
  value: string;
  label: string;
  year: number;
  month: number;
};

/**
 * ЗАПИСЬ В ФОРМЕ (react-hook-form)
 * Используется ТОЛЬКО на клиенте
 */
export type ScheduleEntryForm = {
  id: string; // Клиентский ID для key в React
  employeeId?: string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
};

/**
 * ЗАПИСЬ ДЛЯ СОЗДАНИЯ (POST /schedules)
 */
export type ScheduleEntryCreate = {
  employeeId?: string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
  notes?: string;
};

/**
 * ЗАПИСЬ ДЛЯ ОБНОВЛЕНИЯ СУЩЕСТВУЮЩЕЙ (PATCH /schedules/:id)
 * _id - обязателен, это ObjectId из MongoDB
 */
export type ScheduleEntryUpdateExisting = {
  _id: string; // Обязателен! ObjectId из MongoDB
  employeeId?: string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
  notes?: string;
};

/**
 * ЗАПИСЬ ДЛЯ ДОБАВЛЕНИЯ НОВОЙ ПРИ ОБНОВЛЕНИИ (PATCH /schedules/:id)
 * Без _id, потому что это новая запись
 */
export type ScheduleEntryUpdateNew = {
  employeeId?: string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
  notes?: string;
};

/**
 * Модель для обновления графика (PATCH)
 * entries может содержать mix существующих и новых записей
 */
export type ScheduleUpdateModel = {
  entries?: (ScheduleEntryUpdateExisting | ScheduleEntryUpdateNew)[];
  isPublished?: boolean;
  notes?: string;
};

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
 * Основная форма создания графика
 */
export type ScheduleFormValues = {
  month: string;
  scheduleType: ScheduleType;
  entries: ScheduleEntryForm[];
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

/**
 * Модель для создания графика (POST)
 */
export type ScheduleCreateModel = {
  month: string;
  scheduleType: ScheduleType;
  entries: ScheduleEntryCreate[];
  notes?: string;
};

/**
 * Ответ API
 */
export type ScheduleApiResponse = {
  data: ScheduleModel;
  msg: string;
};

export type SchedulesApiResponse = {
  data: ScheduleModel[];
  msg: string;
  total?: number;
};

/**
 * Состояние снекбара
 */
export type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};

/**
 * Пропсы компонентов
 */
export type ScheduleEntryRowProps = {
  index: number;
  onRemove: () => void;
  disabled?: boolean;
};

export type ScheduleTypeSelectorProps = {
  disabled?: boolean;
};

export type EditSchedulePanelProps = {
  scheduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export type ScheduleProps = {
  id: string;
};
