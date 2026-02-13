import { MONTHS } from "@const/consts";


/**
 * Получение количества дней в месяце
 * Исправленная версия: правильно работает с граничными условиями
 */
export const getDaysInMonthForSchedule = (
  year: number,
  month: number
): number => {
  // month: 1-12 (январь-декабрь)
  // Date(year, month, 0) возвращает последний день предыдущего месяца
  return new Date(year, month, 0).getDate();
};

/**
 * Получение дня недели первого дня месяца
 * 0 - воскресенье, 1 - понедельник, ..., 6 - суббота
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  // month: 1-12 (январь-декабрь)
  const date = new Date(year, month - 1, 1);
  return date.getDay();
};

/**
 * Проверка, является ли день месяца выходным
 */
export const isDayWeekend = (
  year: number,
  month: number,
  day: number
): boolean => {
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

/**
 * Парсинг строки месяца формата "YYYY-MM"
 * Возвращает {year: number, month: number} или null при ошибке
 */
export const parseMonthYear = (
  monthString: string
): { year: number; month: number } | null => {
  if (!monthString) return null;

  const regex = /^(\d{4})-(\d{2})$/;
  const match = monthString.match(regex);

  if (!match) return null;

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);

  if (month < 1 || month > 12) return null;

  return { year, month };
};

export const parseScheduleDate = (
  date: string
): {
  year: string;
  month:
    | 'январь'
    | 'февраль'
    | 'март'
    | 'апрель'
    | 'май'
    | 'июнь'
    | 'июль'
    | 'август'
    | 'сентябрь'
    | 'октябрь'
    | 'ноябрь'
    | 'декабрь';
} => {
  const [year, month] = date.split('-');
  const monthName = MONTHS[Number(month) - 1];

  return { year, month: monthName };
};
