import { getCurrentPlan } from '@api/planApi';
import { useState, useCallback, useEffect, useRef } from 'react';
import { WorkPlan } from 'src/types/plan.types';

type UsePlanDisplayReturn = {
  // Данные
  plan?: WorkPlan;
  isLoading: boolean;
  error: string | null;

  // Методы
  handlePrint: () => void;
  refetchMenu: () => void;
  clearError: () => void;
};

export const usePlanDisplay = (): UsePlanDisplayReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState<WorkPlan>();

  const loadData = async () => {
    setIsLoading(true);

    try {
      const response = await getCurrentPlan();

      if (response.success && response.data) {
        setPlanData(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Печать меню
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const isFetchingRef = useRef(false);

  const refetchMenu = useCallback(async () => {
    if (isFetchingRef.current) return; // Защита от двойного клика

    isFetchingRef.current = true;
    try {
      await loadData();
    } finally {
      isFetchingRef.current = false;
    }
  }, []);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    plan: planData,
    isLoading,
    error,

    handlePrint,
    refetchMenu,
    clearError,
  };
};
