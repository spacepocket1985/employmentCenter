import { useState, useEffect, useCallback, useRef } from 'react';
import {
  IMealDealResponse,
  TMealDealType,
  getMealDealTypeConfig,
} from 'src/types/mealDeal.types';
import { getMealDealByType } from 'src/api/mealDealApi';
import { ApiResponse } from 'src/types/menu.types';

/**
 * Интерфейс возвращаемых значений хука useMealDeal
 */
export interface UseMealDealReturn {
  /** Данные обеда */
  data: IMealDealResponse | null;
  /** Состояние загрузки */
  isLoading: boolean;
  /** Ошибка */
  error: string | null;
  /** Текущий тип обеда */
  currentType: TMealDealType;
  /** Выбранная дата */
  date: string | null;

  /** Установить тип обеда */
  setType: (type: TMealDealType) => void;
  /** Установить дату */
  setDate: (date: string | null) => void;
  /** Загрузить новый случайный обед (рефетч) */
  refetch: () => Promise<void>;
  /** Очистить ошибку */
  clearError: () => void;
  /** Сбросить все */
  reset: () => void;
}

/**
 * Хук для управления MealDeal (рекомендациями обедов)
 *
 * @param initialType - начальный тип обеда (по умолчанию 'balanced')
 * @param initialDate - начальная дата (по умолчанию null)
 *
 * @example
 * const { data, isLoading, setType, refetch } = useMealDeal('balanced', '01.09.26');
 *
 * // Сменить тип
 * setType('economy');
 *
 * // Обновить обед
 * refetch();
 */
export const useMealDeal = (
  initialType: TMealDealType = 'balanced',
  initialDate: string | null = null
): UseMealDealReturn => {
  // ===== СОСТОЯНИЯ =====
  const [data, setData] = useState<IMealDealResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentType, setCurrentType] = useState<TMealDealType>(initialType);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

  // Защита от множественных запросов
  const isFetchingRef = useRef<boolean>(false);

  // ===== ОСНОВНАЯ ФУНКЦИЯ ЗАГРУЗКИ =====
  /**
   * Загружает данные обеда по текущему типу и дате
   */
  const loadMealDeal = useCallback((): Promise<void> => {
    // Защита от множественных запросов
    if (isFetchingRef.current) {
      return Promise.resolve();
    }

    setIsLoading(true);
    setError(null);
    isFetchingRef.current = true;

    return getMealDealByType(currentType, selectedDate || undefined)
      .then((response: ApiResponse<IMealDealResponse>) => {
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Не удалось загрузить рекомендацию');
          setData(null);
        }
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(`Ошибка загрузки: ${errorMessage}`);
        setData(null);
        console.error('Error loading meal deal:', err);
      })
      .finally(() => {
        setIsLoading(false);
        isFetchingRef.current = false;
      });
  }, [currentType, selectedDate]);

  // ===== ЗАГРУЗКА ПРИ ИЗМЕНЕНИИ ТИПА ИЛИ ДАТЫ =====
  useEffect(() => {
    loadMealDeal();
  }, [loadMealDeal]);

  // ===== МЕТОДЫ ДЛЯ УПРАВЛЕНИЯ =====

  /**
   * Установить тип обеда
   * При смене типа автоматически загружаются новые данные
   */
  const setType = useCallback(
    (type: TMealDealType): void => {
      if (type !== currentType) {
        setCurrentType(type);
        // Данные загрузятся автоматически через useEffect
      }
    },
    [currentType]
  );

  /**
   * Установить дату
   * При смене даты автоматически загружаются новые данные
   */
  const handleSetDate = useCallback(
    (newDate: string | null): void => {
      if (newDate !== selectedDate) {
        setSelectedDate(newDate);
        // Данные загрузятся автоматически через useEffect
      }
    },
    [selectedDate]
  );

  /**
   * Загрузить новый случайный обед (рефетч)
   * Принудительно перезагружает данные с тем же типом и датой
   */
  const refetch = useCallback((): Promise<void> => {
    return loadMealDeal();
  }, [loadMealDeal]);

  /**
   * Очистить ошибку
   */
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  /**
   * Сбросить все состояния
   */
  const reset = useCallback((): void => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setCurrentType(initialType);
    setSelectedDate(initialDate);
    isFetchingRef.current = false;
  }, [initialType, initialDate]);

  // ===== ВОЗВРАЩАЕМЫЕ ЗНАЧЕНИЯ =====
  return {
    data,
    isLoading,
    error,
    currentType,
    date: selectedDate,
    setType,
    setDate: handleSetDate,
    refetch,
    clearError,
    reset,
  };
};

/**
 * Получить конфигурацию типа обеда (обертка для удобства)
 */
export const useMealDealTypeConfig = (
  type: TMealDealType
): ReturnType<typeof getMealDealTypeConfig> => {
  return getMealDealTypeConfig(type);
};
