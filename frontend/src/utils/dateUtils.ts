import { WorkPlan, MonthOption } from 'src/types/workPlan.types';

export const MONTHS = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
] as const;

export const DAYS_OF_WEEK = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
] as const;

// Получить дни месяца
export const getDaysInMonth = (year: number, month: number): Date[] => {
  const date = new Date(year, month - 1, 1);
  const days: Date[] = [];

  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

// Получить рабочие дни
export const getWorkingDays = (
  year: number, 
  month: number, 
  workingSaturdays: number[] = []
): { date: Date; dayNumber: number; dayOfWeek: string; isSaturday: boolean }[] => {
  const allDays = getDaysInMonth(year, month);
  
  const workingDays = allDays.filter(day => {
    const dayOfWeek = day.getDay();
    const dayNumber = day.getDate();
    
    // Понедельник-пятница всегда рабочие
    if (dayOfWeek >= 1 && dayOfWeek <= 5) return true;
    
    // Суббота, если выбрана пользователем
    if (dayOfWeek === 6 && workingSaturdays.includes(dayNumber)) return true;
    
    // Воскресенье - не рабочий
    return false;
  });
  
  return workingDays.map(day => ({
    date: day,
    dayNumber: day.getDate(),
    dayOfWeek: DAYS_OF_WEEK[day.getDay()],
    isSaturday: day.getDay() === 6,
  }));
};

// Получить все субботы месяца
export const getSaturdaysOfMonth = (year: number, month: number): { dayNumber: number; dayOfWeek: string; isSaturday: true }[] => {
  const allDays = getDaysInMonth(year, month);
  
  return allDays
    .filter(day => day.getDay() === 6) // Только субботы
    .map(day => ({
      dayNumber: day.getDate(),
      dayOfWeek: DAYS_OF_WEEK[6],
      isSaturday: true,
    }));
};

// Сгенерировать доступные месяцы (на 2 года вперед)
export const getAvailableMonths = (
  existingPlans: WorkPlan[]
): MonthOption[] => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const months: MonthOption[] = [];

  // На 2 года вперед
  for (let year = currentYear; year <= currentYear + 2; year++) {
    const startMonth = year === currentYear ? currentMonth : 1;

    for (let month = startMonth; month <= 12; month++) {
      const monthStr = MONTHS[month - 1];

      // Проверяем, есть ли уже план на этот месяц
      const hasExistingPlan = existingPlans.some(
        (plan) => plan.year === year && plan.monthNumber === month
      );

      months.push({
        value: `${year}-${month}`,
        label: `${monthStr} ${year}`,
        monthNumber: month,
        year,
        isAvailable: !hasExistingPlan,
      });
    }
  }

  return months;
};
