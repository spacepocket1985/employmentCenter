/**
 * Тип графика дежурств
 */
export type ScheduleType = 'responsibleOnWeekends' | 'safetyOfficers';

/**
 * Модель для отображения типа графика
 */
export type ScheduleTypeDisplay = {
  value: ScheduleType;
  label: string;
  description: string;
};

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
 * Запись в графике (строка таблицы)
 */
export type ScheduleEntryForm = {
  id: string; // Уникальный идентификатор строки
  employeeId?: string; // ID сотрудника (если из базы)
  customName: string; // ФИО (может быть из базы или ручной ввод)
  customJob: string; // Должность
  dates: string[]; // Массив дат в формате "2024-01-15"
  orderIndex: number; // Порядковый номер строки
};



/**
 * Основная форма создания графика
 */
export type ScheduleFormData = {
  month: string; // Выбранный месяц в формате "2024-01"
  scheduleType: ScheduleType; // Тип графика
  entries: ScheduleEntryForm[]; // Список записей
};

/**
 * Результат валидации даты
 */
export type DateValidationResult = {
  isValid: boolean;
  error?: string;
};

/**
 * Ошибки валидации формы графика
 */
export type ScheduleValidationErrors = {
  month?: string;
  scheduleType?: string;
  entries?: Record<string, string[]>; // key: ID записи, value: массив ошибок
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
  entry: ScheduleEntryForm;
  index: number;
  onUpdate: (updates: Partial<ScheduleEntryForm>) => void;
  onRemove: () => void;
  onAddDate: (date: string) => void;
  onRemoveDate: (date: string) => void;
  errors?: string[];
  disabled?: boolean;
};

/**
 * Пропсы для компонента выбора типа графика
 */
export type ScheduleTypeSelectorProps = {
  scheduleType: ScheduleType;
  onChange: (type: ScheduleType) => void;
  error?: string;
  disabled?: boolean;
};

/**
 * Пропсы для компонента обертки загрузки/ошибок
 */
export type LoadingErrorWrapperProps = {
  isLoading: boolean;
  error?: unknown;
  children: React.ReactNode;
  onRetry?: () => void;
};

export type ScheduleFormValues = {
  month: string;
  scheduleType: 'responsibleOnWeekends' | 'safetyOfficers';
  entries: ScheduleEntryForm[];
};


export type ScheduleCreateModel = {
  month: string;
  scheduleType: ScheduleType;
  entries: Omit<ScheduleEntryForm, 'id'>[];
  notes?: string;
};

export type ScheduleUpdateModel = {
  entries?: Omit<ScheduleEntryForm, 'id'>[];
  isPublished?: boolean;
  notes?: string;
};
