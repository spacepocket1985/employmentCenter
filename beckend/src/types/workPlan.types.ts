// Мероприятие (строка в таблице)
export type Event = {
  id: string;
  time: string; // "08-15", "13-25", "" (если весь день)
  description: string;
  responsiblePersons: string[];
  notes?: string;
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
};

// Для запросов API
export type CreateWorkPlanRequest = {
  month: string;
  monthNumber: number;
  year: number;
  days: DayPlan[];
};

export type UpdateWorkPlanRequest = {
  days?: DayPlan[];
};

// Ответ API
export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};