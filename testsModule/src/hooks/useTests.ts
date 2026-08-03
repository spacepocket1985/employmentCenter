// Описание: Хук для загрузки тестов с бэкенда
// Использует useApi для управления состоянием загрузки

import { useApi } from '@hooks/useApi';


import type { TestApiResponse, TestsApiResponse } from 'src/types/tests.types';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import { selectAllTests, setError, setTests } from '@store/slices';
import { testsEndpoint } from '@api/endPoints';

/**
 * Хук для загрузки и управления тестами
 * Автоматически загружает тесты при монтировании
 * @returns Объект с состоянием загрузки и функцией обновления
 */
export const useTests = (): {
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const dispatch = useAppDispatch();
  
  // Получаем текущие тесты из store
  const tests = useAppSelector(selectAllTests);

  // Используем useApi для загрузки данных
  const { loading, error, refetch } = useApi<TestsApiResponse>(
    'tests',
    { method: 'GET' },
    { 
      autoLoad: tests.length === 0, // Загружаем только если тестов нет
      onSuccess: (response: TestsApiResponse): void => {
        if (response.data) {
          dispatch(setTests(response.data));
        }
      },
      onError: (err: Error): void => {
        dispatch(setError(err.message));
      },
    }
  );

  return {
    loading,
    error,
    refetch,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useTestById = (id: string, shuffleOptions: boolean = true) => {
  return useApi<TestApiResponse>(
    `${testsEndpoint}/${id}?shuffleOptions=${shuffleOptions}`,
    { method: 'GET' },
    { autoLoad: !!id }
  );
};