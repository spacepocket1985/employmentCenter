export type Event = {
  id: string;
  time: string;
  description: string;
  responsiblePersons: string[];
  notes?: string;
};

export type DayPlan = {
  id: string;
  dayNumber: number;
  dayOfWeek: string;
  isSpecialDay?: boolean;
  specialDayTitle?: string;
  events: Event[];
};

export type WorkPlan = {
  id?: string;
  month: string;
  monthNumber: number;
  year: number;
  days: DayPlan[];
};

export type CreateWorkPlanRequest = {
  month: string;
  monthNumber: number;
  year: number;
  days: DayPlan[];
};

export type UpdateWorkPlanRequest = {
  days?: DayPlan[];
};

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
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
