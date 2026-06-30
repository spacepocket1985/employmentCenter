import {
  TimeValue,
  isSimpleTime,
  isRangeTime,
  isTextTime,
  isContinuedTime,
  isDaySpecificTime,
  DayType,
} from 'src/types/busRoute.types';

export function extractTime(value: TimeValue): string | null {
  if (isSimpleTime(value)) {
    return value.simpleTime;
  }

  if (isRangeTime(value)) {
    return value.dayRange.time;
  }

  if (isTextTime(value)) {
    return value.text;
  }

  if (isContinuedTime(value)) {
    return null;
  }

  if (isDaySpecificTime(value)) {
    const ds = value.daySpecific;

    // Проверяем все возможные поля в порядке приоритета
    const timeValue =
      ds.monday_thursday ??
      ds.friday ??
      ds.saturday ??
      ds.sunday ??
      ds.working ??
      ds.weekend ??
      ds.holiday;

    return timeValue || null;
  }

  return null;
}

/**
 * Получить период (утро/вечер) для отображения
 */
export const getPeriodLabel = (period: 'morning' | 'evening'): string => {
  return period === 'morning' ? 'Утро' : 'Вечер';
};

/**
 * Получить день недели для отображения (для type guard)
 */
export const getDayTypeDisplay = (dayType: DayType): string => {
  const labels: Record<DayType, string> = {
    working: 'Рабочие дни',
    weekend: 'Выходные дни',
    holiday: 'Праздничные дни',
    monday_thursday: 'Пн-Чт',
    friday: 'Пт',
    saturday: 'Сб',
    sunday: 'Вс',
  };
  return labels[dayType];
};

/**
 * Проверяет, является ли остановка специальной отметкой
 */
export const isSpecialNote = (stop: { isSpecialNote?: boolean }): boolean => {
  return Boolean(stop.isSpecialNote);
};

export function formatDateWithoutSeconds(dateString: string): string {
  // Создаем объект Date из строки
  const date = new Date(dateString);

  // Проверяем, валидная ли дата
  if (isNaN(date.getTime())) {
    throw new Error('Неверный формат даты');
  }

  // Получаем компоненты даты
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 потому что месяцы с 0
  const year = date.getFullYear();

  // Получаем компоненты времени
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Возвращаем в формате "дд.мм.гггг чч:мм"
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
