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
  value: string; // Формат: "2024-01"
  label: string; // "Январь 2024"
  year: number;
  month: number;
};

/**
 * Запись в графике для ФОРМЫ (react-hook-form)
 * Использует id (без подчеркивания) для работы с формой
 */
export type ScheduleEntryForm = {
  id: string; // Уникальный идентификатор строки (будет маппиться с _id из API)
  employeeId?: string; // Только ID сотрудника, не объект!
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
};

/**
 * Запись в графике из API (как приходит с бэкенда)
 * Сохраняем оригинальную структуру с _id и объектом employeeId
 */
export type ScheduleEntryApi = {
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
 * Основная форма создания графика (для формы)
 */
export type ScheduleFormValues = {
  month: string;
  scheduleType: ScheduleType;
  entries: ScheduleEntryForm[];
};

/**
 * Модель графика из API (полная структура)
 */
export type ScheduleModel = {
  _id: string;
  month: string;
  scheduleType: ScheduleType;
  entries: ScheduleEntryApi[];
  notes?: string;
  createdBy?: string | null;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

/**
 * Модель для создания графика (отправка на бэкенд)
 */
export type ScheduleCreateModel = {
  month: string;
  scheduleType: ScheduleType;
  entries: Omit<ScheduleEntryForm, 'id'>[];
  notes?: string;
};

/**
 * Модель для обновления графика (отправка на бэкенд)
 */
export type ScheduleUpdateModel = {
  entries?: Array<{
    _id: string; // ID записи из БД
    customName: string;
    customJob: string;
    dates: string[];
    orderIndex: number;
    employeeId?: string;
  }>;
  isPublished?: boolean;
  notes?: string;
};

/**
 * Ответ API при получении одного графика
 */
export type ScheduleApiResponse = {
  data: ScheduleModel;
  msg: string;
  success?: boolean;
};

/**
 * Ответ API при получении списка графиков
 */
export type SchedulesApiResponse = {
  data: ScheduleModel[];
  msg: string;
  total?: number;
};

/**
 * Состояние снекбара (уведомления)
 */
export type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};

/**
 * Пропсы для компонента строки графика
 */
export type ScheduleEntryRowProps = {
  index: number;
  onRemove: () => void;
  disabled?: boolean;
};

/**
 * Пропсы для компонента выбора типа графика
 */
export type ScheduleTypeSelectorProps = {
  disabled?: boolean;
};

/**
 * Пропсы для компонента редактирования графика
 */
export type EditSchedulePanelProps = {
  scheduleId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

/**
 * Пропсы для компонента просмотра графика
 */
export type ScheduleProps = {
  id: string;
};
