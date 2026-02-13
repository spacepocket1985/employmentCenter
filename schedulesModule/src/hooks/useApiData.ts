import { useState, useCallback, useEffect, useRef } from 'react';
import { ApiResponse } from 'src/types';

export type UseApiDataReturn<T> = {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
  isLoaded: boolean;
  lastUpdated: Date | null;
};

export type UseApiDataConfig<P> = {
  autoLoad?: boolean;
  params?: P;
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
  retryCount?: number;
  retryDelay?: number;
};

/**
 * Универсальный хук для работы с API-запросами
 * @param fetchFn - функция запроса (должна быть стабильной или мемоизированной)
 * @param config - конфигурация
 */
export const useApiData = <T, P = void>(
  fetchFn: (params?: P) => Promise<ApiResponse<T>>,
  config?: UseApiDataConfig<P>
): UseApiDataReturn<T> => {
  const {
    autoLoad = true,
    params,
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000,
  } = config || {};

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<T>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);
  const fetchFnRef = useRef(fetchFn);
  const paramsRef = useRef(params);

  // Обновляем ref при изменении зависимости
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  useEffect(() => {
    paramsRef.current = params;
  }, [params]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    if (isFetchingRef.current) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }

    abortControllerRef.current = new AbortController();
    
    isFetchingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFnRef.current(paramsRef.current);

      if (!mountedRef.current) return;

      if (response.success && response.data) {
        setData(response.data);
        setIsLoaded(true);
        setLastUpdated(new Date());
        retryCountRef.current = 0;
        onSuccess?.(response.data);
      } else {
        const errorMessage = response.message || 'Неизвестная ошибка';
        setError(errorMessage);
        setData(undefined);
        onError?.(errorMessage);

        if (retryCountRef.current < retryCount) {
          retryCountRef.current += 1;
          retryTimeoutRef.current = setTimeout(() => {
            if (mountedRef.current) {
              loadData();
            }
          }, retryDelay * retryCountRef.current);
        }
      }
    } catch (error) {
      if (!mountedRef.current) return;
      
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }
      
      const errorMessage = (error as Error).message;
      setError(errorMessage);
      setData(undefined);
      onError?.(errorMessage);

      if (retryCountRef.current < retryCount) {
        retryCountRef.current += 1;
        retryTimeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            loadData();
          }
        }, retryDelay * retryCountRef.current);
      }
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
      abortControllerRef.current = null;
    }
  }, [onSuccess, onError, retryCount, retryDelay]);

  // Эффект для начальной загрузки
  useEffect(() => {
    if (autoLoad) {
      loadData();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [autoLoad, loadData]);

  const refetch = useCallback(async () => {
    retryCountRef.current = 0;
    await loadData();
  }, [loadData]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setData(undefined);
    setError(null);
    setIsLoading(false);
    setIsLoaded(false);
    setLastUpdated(null);
    retryCountRef.current = 0;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch,
    clearError,
    reset,
    isLoaded,
    lastUpdated,
  };
};