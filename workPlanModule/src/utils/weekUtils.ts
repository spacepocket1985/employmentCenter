// utils/weekUtils.ts
import { DayPlan, WorkPlan } from 'src/types/plan.types';

export interface WeekInfo {
  weekNumber: number;
  startDay: number;
  endDay: number;
  days: DayPlan[];
  label: string;
}

/**
 * Получает номер недели в месяце для указанного дня
 */
const getWeekNumberInMonth = (dayNumber: number): number => {
  return Math.ceil(dayNumber / 7);
};

/**
 * Получает диапазон дней для недели по номеру недели
 */
const getWeekRange = (weekNumber: number): { start: number; end: number } => {
  const start = (weekNumber - 1) * 7 + 1;
  const end = weekNumber * 7;
  return { start, end };
};

/**
 * Разбивает план мероприятий на недели
 */
export const splitPlanIntoWeeks = (plan: WorkPlan): WeekInfo[] => {
  if (!plan || !plan.days.length) return [];

  // Создаем маппинг дней по их номерам для быстрого доступа
  const daysMap = new Map<number, DayPlan>();
  plan.days.forEach((day) => {
    daysMap.set(day.dayNumber, day);
  });

  // Определяем максимальный день в плане
  const maxDay = Math.max(...plan.days.map((day) => day.dayNumber));

  // Определяем количество недель в месяце
  const totalWeeks = Math.ceil(maxDay / 7);

  const weeks: WeekInfo[] = [];

  // Создаем недели
  for (let weekNumber = 1; weekNumber <= totalWeeks; weekNumber++) {
    const { start, end } = getWeekRange(weekNumber);

    // Фильтруем дни, которые попадают в эту неделю
    const weekDays: DayPlan[] = [];

    for (let dayNumber = start; dayNumber <= end; dayNumber++) {
      const day = daysMap.get(dayNumber);
      if (day) {
        weekDays.push(day);
      }
    }

    // Сортируем дни по возрастанию
    weekDays.sort((a, b) => a.dayNumber - b.dayNumber);

    // Формируем метку недели
    const weekLabel = getWeekLabel(
      weekNumber,
      start,
      end,
      plan.monthNumber,
      plan.year
    );

    weeks.push({
      weekNumber,
      startDay: start,
      endDay: end,
      days: weekDays,
      label: weekLabel,
    });
  }

  // Фильтруем только недели, в которых есть дни
  return weeks.filter((week) => week.days.length > 0);
};

/**
 * Получает текущую неделю (содержит сегодняшний день)
 */
export const getCurrentWeek = (
  weeks: WeekInfo[],
  currentDate: Date = new Date()
): WeekInfo | null => {
  const currentDay = currentDate.getDate();

  return (
    weeks.find(
      (week) => currentDay >= week.startDay && currentDay <= week.endDay
    ) ||
    weeks[0] ||
    null
  );
};

/**
 * Форматирует метку недели
 */
export const getWeekLabel = (
  weekNumber: number,
  startDay: number,
  endDay: number,
  monthNumber: number,
  year: number
): string => {
  const monthNames = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const monthName = monthNames[monthNumber - 1];

  return `Неделя ${weekNumber} (${startDay}-${endDay} ${monthName})`;
};

/**
 * Проверяет, является ли день сегодняшним
 */
export const isToday = (
  dayNumber: number,
  monthNumber: number,
  year: number
): boolean => {
  const today = new Date();
  return (
    today.getDate() === dayNumber &&
    today.getMonth() + 1 === monthNumber &&
    today.getFullYear() === year
  );
};

/**
 * Получает дни недели с учетом их наличия в плане
 */
export const getWeekDaysWithData = (
  week: WeekInfo,
  plan: WorkPlan
): Array<{
  dayNumber: number;
  hasData: boolean;
  isSpecialDay?: boolean;
  isToday: boolean;
}> => {
  const result = [];

  for (let dayNumber = week.startDay; dayNumber <= week.endDay; dayNumber++) {
    const day = week.days.find((d) => d.dayNumber === dayNumber);
    const hasData = !!day;
    const isSpecialDay = day?.isSpecialDay || false;
    const isTodayVal = isToday(dayNumber, plan.monthNumber, plan.year);

    result.push({
      dayNumber,
      hasData,
      isSpecialDay,
      isToday: isTodayVal,
    });
  }

  return result;
};
