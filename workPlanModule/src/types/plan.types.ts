// Базовый тип ответа от API
interface BaseApiResponse {
  success: boolean;
  message: string;
  errors?: string[];
}

// Типизированный ответ от API
export interface ApiResponse<T = unknown> extends BaseApiResponse {
  data?: T;
}

export type Event = {
  id: string;
  time: string;
  description: string;
  responsiblePersons: string[];
  notes?: string;
};

export type Announcement = {
  id: string;
  dayNumber: number;
  title: string;
  style?: 'warning' | 'info' | 'success' | 'primary';
  order?: number; // Порядок отображения (по умолчанию 0)
};

// День плана
export type DayPlan = {
  id: string;
  dayNumber: number; // Число месяца: 5, 6, 7...
  dayOfWeek: string; // "понедельник", "вторник"...
  isSpecialDay?: boolean; // Праздник или день с одним мероприятием
  specialDayTitle?: string; // "Рождество!" или подобное
  events: Event[];
};

// Основной план на месяц
export type WorkPlan = {
  id: string; // MongoDB ID
  month: string; // "январь 2026"
  monthNumber: number; // 1-12
  year: number; // 2026
  days: DayPlan[]; // Только дни с мероприятиями
  announcements: Announcement[]; // Анонсы мероприятий
  workingSaturdays?: number[];
};

// Для запросов API
export type CreateWorkPlanRequest = {
  month: string;
  monthNumber: number;
  year: number;
  days: DayPlan[];
  announcements?: Announcement[];
  workingSaturdays?: number[];
};

export type UpdateWorkPlanRequest = {
  days?: DayPlan[];
  announcements?: Announcement[];
  workingSaturdays?: number[];
};

// Тип для UI
export type MonthOption = {
  value: string;
  label: string;
  monthNumber: number;
  year: number;
  isAvailable: boolean;
};

export type WorkingDay = {
  date: Date;
  dayNumber: number;
  dayOfWeek: string;
  isSaturday: boolean;
  isSelected: boolean;
};

export type SaturdayData = {
  dayNumber: number;
  dayOfWeek: string;
  isSaturday: true;
};

export type LocalEvent = {
  id: string;
  time: string;
  description: string;
  responsiblePersons: string[];
  notes?: string;
};

export type LocalDayPlan = {
  id: string;
  dayNumber: number;
  dayOfWeek: string;
  isSpecialDay?: boolean;
  specialDayTitle?: string;
  events: LocalEvent[];
};

// Новый тип для UI
export type LocalAnnouncement = {
  id: string;
  dayNumber: number;
  title: string;
  style?: 'warning' | 'info' | 'success' | 'primary';
  order?: number;
};

// Вспомогательные типы для бэкенда
export type ProcessedEvent = {
  id: string;
  time: string;
  description: string;
  responsiblePersons: string[];
  notes?: string;
};

export type ProcessedDayPlan = {
  id: string;
  dayNumber: number;
  dayOfWeek: string;
  isSpecialDay?: boolean;
  specialDayTitle?: string;
  events: ProcessedEvent[];
};
