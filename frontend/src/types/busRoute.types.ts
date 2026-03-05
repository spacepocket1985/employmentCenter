export type DayType =
  | 'working' // рабочие дни
  | 'weekend' // выходные
  | 'holiday' // праздничные
  | 'monday_thursday' // Пн-Чт
  | 'friday' // Пт
  | 'saturday' // Сб
  | 'sunday'; // Вс

/**
 * Простое время (например: "07.10", "08.15", "17.25")
 * Используется для обычных остановок с фиксированным временем
 */
export type SimpleTime = {
  type: 'simple'; // Дискриминант для type guard
  simpleTime: string; // Время в формате "ЧЧ.ММ" или "ЧЧ:ММ"
};

/**
 * Диапазон дней (например: "Пн-Чт 17.25")
 * Используется когда время одинаковое для нескольких дней недели
 */
export type RangeTime = {
  type: 'range'; // Дискриминант для type guard
  dayRange: {
    from: DayType; // Начальный день (например: 'monday_thursday')
    to: DayType; // Конечный день (например: 'friday')
    time: string; // Время в формате "ЧЧ.ММ" или "ЧЧ:ММ"
  };
};

/**
 * Текстовая отметка (например: "Простой транспорта (0,5 часа)")
 * Используется для специальных записей между остановками
 */
export type TextTime = {
  type: 'text'; // Дискриминант для type guard
  text: string; // Текст специальной отметки
};

/**
 * Отметка "Далее по маршруту"
 * Используется когда время не указано, а маршрут продолжается
 */
export type ContinuedTime = {
  type: 'continued'; // Дискриминант для type guard
  isContinued: true; // Флаг продолжения маршрута
};

/**
 * Разное время для разных дней (например: "Пн-Чт 17.25 / Пт 16.10")
 * Используется когда в разные дни разное время
 */
export type DaySpecificTime = {
  type: 'daySpecific'; // Дискриминант для type guard
  daySpecific: {
    monday_thursday?: string; // Время для Пн-Чт
    friday?: string; // Время для Пт
    saturday?: string; // Время для Сб
    sunday?: string; // Время для Вс
    working?: string; // Время для рабочих дней
    weekend?: string; // Время для выходных
    holiday?: string; // Время для праздников
  };
};

/**
 * Объединенный тип TimeValue - может быть одним из пяти вариантов
 */
export type TimeValue =
  | SimpleTime
  | RangeTime
  | TextTime
  | ContinuedTime
  | DaySpecificTime; // Добавили daySpecific

// ============================================
// TYPE GUARDS - функции для проверки типа TimeValue
// ============================================

/**
 * Проверяет, является ли TimeValue простым временем
 */
export const isSimpleTime = (value: TimeValue): value is SimpleTime =>
  value.type === 'simple';

/**
 * Проверяет, является ли TimeValue диапазоном дней
 */
export const isRangeTime = (value: TimeValue): value is RangeTime =>
  value.type === 'range';

/**
 * Проверяет, является ли TimeValue текстовой отметкой
 */
export const isTextTime = (value: TimeValue): value is TextTime =>
  value.type === 'text';

/**
 * Проверяет, является ли TimeValue отметкой "далее по маршруту"
 */
export const isContinuedTime = (value: TimeValue): value is ContinuedTime =>
  value.type === 'continued';

/**
 * Проверяет, является ли TimeValue разным временем для разных дней
 */
export const isDaySpecificTime = (value: TimeValue): value is DaySpecificTime =>
  value.type === 'daySpecific';

// ============================================
// ТИПЫ ДЛЯ ФОРМ
// ============================================

/**
 * Тип для остановки в форме (с клиентским id)
 */
export type BusStopForm = {
  id: string; // Клиентский ID для React key
  orderNumber: number; // Порядковый номер в маршруте
  name: string; // Название остановки
  address: string; // Адрес остановки
  time: TimeValue; // Время (может быть разных типов)
  isSpecialNote?: boolean; // Флаг специальной отметки
};

/**
 * Тип для транспортного средства в форме
 */
export type VehicleForm = {
  id: string; // Клиентский ID для React key
  model: string; // Модель ТС (например: "МАЗ-256")
  capacity?: number; // Вместимость (опционально)
};

/**
 * Тип для записи расписания в форме
 */
export type ScheduleEntryForm = {
  id: string; // Клиентский ID для React key
  period: 'morning' | 'evening'; // Утро или вечер
  dayTypes: DayType[]; // Типы дней действия
  vehicles: VehicleForm[]; // Транспортные средства
  busStops: BusStopForm[]; // Остановки
  notes?: string; // Примечания
};

/**
 * Тип для значений формы маршрута
 */
export type BusRouteFormValues = {
  routeNumber: string; // Номер маршрута
  routeName?: string; // Название маршрута (опционально)
  description?: string; // Описание
  schedules: ScheduleEntryForm[]; // Расписания
  isActive: boolean; // Активен/неактивен
};

// ============================================
// ТИПЫ ДЛЯ ОТПРАВКИ НА БЭКЕНД
// ============================================

/**
 * Тип для создания маршрута (DTO)
 */
export type CreateBusRouteDTO = {
  routeNumber: string;
  routeName?: string;
  description?: string;
  schedules: {
    period: 'morning' | 'evening';
    dayTypes: DayType[];
    vehicles: { model: string; capacity?: number }[];
    busStops: {
      orderNumber: number;
      name: string;
      address: string;
      time: TimeValue;
      isSpecialNote?: boolean;
    }[];
    notes?: string;
  }[];
  isActive?: boolean;
};

/**
 * Тип для обновления маршрута
 */
export type UpdateBusRouteDTO = Partial<CreateBusRouteDTO>;

// ============================================
// ТИПЫ ДЛЯ ОТВЕТА ОТ БЭКЕНДА
// ============================================

/**
 * Модель маршрута из БД
 */
export type BusRouteModel = {
  _id: string;
  routeNumber: string;
  routeName?: string;
  description?: string;
  schedules: {
    _id?: string;
    period: 'morning' | 'evening';
    dayTypes: DayType[];
    vehicles: { model: string; capacity?: number }[];
    busStops: {
      orderNumber: number;
      name: string;
      address: string;
      time: TimeValue;
      isSpecialNote?: boolean;
    }[];
    notes?: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * Ответ API для одного маршрута
 */
export type BusRouteApiResponse = {
  data: BusRouteModel;
  msg: string;
};

/**
 * Ответ API для списка маршрутов
 */
export type BusRoutesApiResponse = {
  data: BusRouteModel[];
  msg: string;
};

// ============================================
// ТИПЫ ДЛЯ UI
// ============================================

/**
 * Состояние снекбара
 */
export type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};
