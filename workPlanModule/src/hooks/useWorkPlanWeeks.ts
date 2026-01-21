import { useState, useEffect, useCallback } from 'react';
import { WorkPlan } from 'src/types/plan.types';
import { WeekInfo, splitPlanIntoWeeks, getCurrentWeek } from '@utils/weekUtils';

interface UseWorkPlanWeeksReturn {
  // Данные
  plan: WorkPlan | null;
  weeks: WeekInfo[];
  currentWeek: WeekInfo | null;
  isLoading: boolean;
  error: string | null;

  // Методы
  setPlan: (plan: WorkPlan) => void;
  clearError: () => void;
  refreshPlan: () => void;
}

export const useWorkPlanWeeks = (
  initialPlan: WorkPlan | null = null
): UseWorkPlanWeeksReturn => {
  const [plan, setPlan] = useState<WorkPlan | null>(initialPlan);
  const [weeks, setWeeks] = useState<WeekInfo[]>([]);
  const [currentWeek, setCurrentWeek] = useState<WeekInfo | null>(null);
  const [isLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Вычисляем недели при изменении плана
  useEffect(() => {
    if (plan) {
      const calculatedWeeks = splitPlanIntoWeeks(plan);
      setWeeks(calculatedWeeks);
      console.log(plan)
      const currentWeekInfo = getCurrentWeek(calculatedWeeks);
      setCurrentWeek(currentWeekInfo);
    } else {
      setWeeks([]);
      setCurrentWeek(null);
    }
  }, [plan]);

  // Методы
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshPlan = useCallback(() => {
    // Здесь можно добавить логику обновления данных с сервера
    // пока просто пересчитываем недели
    if (plan) {
      const calculatedWeeks = splitPlanIntoWeeks(plan);
      setWeeks(calculatedWeeks);

      const currentWeekInfo = getCurrentWeek(calculatedWeeks);
      setCurrentWeek(currentWeekInfo);
    }
  }, [plan]);

  return {
    plan,
    weeks,
    currentWeek,
    isLoading,
    error,
    setPlan,
    clearError,
    refreshPlan,
  };
};
