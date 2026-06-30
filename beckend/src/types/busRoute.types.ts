import { Document, Types } from 'mongoose';

// Тип дня недели/календаря
export type DayType =
  | 'working' // рабочие дни
  | 'weekend' // выходные
  | 'holiday' // праздничные
  | 'monday_thursday' // Пн-Чт
  | 'friday' // Пт
  | 'saturday' // Сб
  | 'sunday'; // Вс

// Тип временной отметки (может быть разного формата)
export type TimeValue = {
  type: 'simple' | 'range' | 'text' | 'continued';

  // Для простого времени (07.10)
  simpleTime?: string; // храним как строку "07.10"

  // Для диапазона с днями (Пн-Чт 17.25)
  dayRange?: {
    from: DayType;
    to: DayType;
    time: string;
  };

  // Для разного времени по дням
  daySpecific?: {
    monday_thursday?: string; // Пн-Чт
    friday?: string; // Пт
    saturday?: string; // Сб
    sunday?: string; // Вс
    working?: string; // рабочие
    weekend?: string; // выходные
  };

  // Для текстовых пометок ("Простой транспорта (0,5 часа)")
  text?: string;

  // Для пометки "Далее по маршруту"
  isContinued?: boolean;
};

// Остановка с временем
export type BusStop = {
  orderNumber: number; // № в маршруте
  name: string; // Остановочный пункт
  address: string; // Адрес остановки
  time: TimeValue; // Контрольное время (гибкий формат)
  isSpecialNote?: boolean; // Флаг для специальных записей (Простой и т.п.)
};

// Тип транспортного средства
export type VehicleType = {
  model: string; // МАЗ-256, МАЗ-206 и т.д.
  capacity?: number; // Вместимость (опционально)
};

// Расписание для конкретного периода и типа дня
export type ScheduleEntry = {
  period: 'morning' | 'evening'; // Утро/Вечер
  dayTypes: DayType[]; // Для каких дней действует
  vehicles: VehicleType[]; // Какие ТС используются
  busStops: BusStop[]; // Остановки с временем
  notes?: string; // Дополнительные примечания
  routeMap?: string;
};

// Основной тип маршрута (для БД)
export type BusRouteBase = {
  routeNumber: string; // Номер маршрута ("1", "2", "3", "4")
  routeName?: string; // Название (опционально)
  description?: string; // Описание маршрута
  schedules: ScheduleEntry[]; // Расписания для разных периодов
  isActive: boolean; // Активен ли маршрут
};

// Тип для создания маршрута
export type BusRouteCreate = BusRouteBase;

// Тип для обновления маршрута
export type BusRouteUpdate = Partial<BusRouteBase>;

// Тип для ответа от БД (с MongoDB полями)
export type BusRouteType = Document &
  BusRouteBase & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  };

// DTO для создания маршрута (без служебных полей)
export type CreateBusRouteDTO = Omit<BusRouteBase, 'isActive'> & {
  isActive?: boolean; // делаем опциональным при создании
};

// DTO для обновления маршрута (все поля опциональны)
export type UpdateBusRouteDTO = Partial<Omit<BusRouteBase, 'routeNumber'>> & {
  routeNumber?: string; // routeNumber тоже опциональный при обновлении
};

// DTO для ответа (то же что и BusRouteType, но для контроллера)
export type BusRouteResponse = Omit<BusRouteType, '__v'>; // исключаем версию документа
