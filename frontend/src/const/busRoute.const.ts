import { DayType } from "src/types/busRoute.types";

export const busRouteListCellTitles = [
  '№ маршрута',
  'Название маршрута',
  'Активный/архивный',
  'Число расписаний',
  'Действия',
];

export const busRouteCellTitles = [
  '№ остановки',
  'Остановочный пункт',
  'Адрес остановки',
  'Контрольное время',
];

// Метки для типов дней
export const DAY_TYPE_LABELS: Record<DayType, string> = {
  working: 'Рабочие дни',
  weekend: 'Выходные дни',
  holiday: 'Праздничные дни',
  monday_thursday: 'Пн-Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

// Все доступные типы дней
export const DAY_TYPES: DayType[] = [
  'working',
  'weekend',
  'holiday',
  'monday_thursday',
  'friday',
  'saturday',
  'sunday',
];


