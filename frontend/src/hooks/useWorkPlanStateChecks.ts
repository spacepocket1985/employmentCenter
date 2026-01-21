import { useMemo } from 'react';
import { LocalDayPlan } from 'src/types/workPlan.types';
import { validateWorkPlan } from '@utils/validationPlan';

interface UseWorkPlanStateChecksProps {
  days: LocalDayPlan[];
  includeValidation?: boolean;
}

export const useWorkPlanStateChecks = ({
  days,
  includeValidation = false,
}: UseWorkPlanStateChecksProps): {
  hasEmptyDays: boolean;
  hasDays: boolean;
  isPlanComplete: boolean;
  daysWithEventsCount: number;
  specialDaysCount: number;
  totalEventsCount: number;
  emptyDayIds: string[];
  specialDayIds: string[];
} => {
  // Проверяем, есть ли дни без мероприятий
  const hasEmptyDays = useMemo(() => {
    return days.some((day) => !day.isSpecialDay && day.events.length === 0);
  }, [days]);

  // Проверяем, есть ли дни вообще
  const hasDays = useMemo(() => {
    return days.length > 0;
  }, [days]);

  // Проверяем, все ли обязательные поля заполнены
  const isPlanComplete = useMemo(() => {
    if (!hasDays) return false;
    if (hasEmptyDays) return false;

    if (includeValidation) {
      const errors = validateWorkPlan(days);
      return errors.length === 0;
    }

    return true;
  }, [days, hasDays, hasEmptyDays, includeValidation]);

  // Считаем количество дней с событиями
  const daysWithEventsCount = useMemo(() => {
    return days.filter((day) => day.events.length > 0).length;
  }, [days]);

  // Считаем количество специальных дней
  const specialDaysCount = useMemo(() => {
    return days.filter((day) => day.isSpecialDay).length;
  }, [days]);

  // Считаем общее количество событий
  const totalEventsCount = useMemo(() => {
    return days.reduce((total, day) => total + day.events.length, 0);
  }, [days]);

  // Получаем ID дней с пустыми событиями
  const emptyDayIds = useMemo(() => {
    return days
      .filter((day) => !day.isSpecialDay && day.events.length === 0)
      .map((day) => day.id);
  }, [days]);

  // Получаем ID дней со специальными мероприятиями
  const specialDayIds = useMemo(() => {
    return days.filter((day) => day.isSpecialDay).map((day) => day.id);
  }, [days]);

  return {
    hasEmptyDays,
    hasDays,
    isPlanComplete,
    daysWithEventsCount,
    specialDaysCount,
    totalEventsCount,
    emptyDayIds,
    specialDayIds,
  };
};
