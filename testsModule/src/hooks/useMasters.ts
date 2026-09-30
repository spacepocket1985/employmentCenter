// Описание: Хук для загрузки списка мастеров
// Использует useApi для управления состоянием загрузки

import { useApi } from '@hooks/useApi';
import { mastersEndpoint } from '@api/endPoints';
import type { EmployeeType, EmployeesApiResponse } from 'src/types/employee.types';

/**
 * Хук для загрузки списка мастеров
 * @returns Объект с состоянием загрузки и функцией обновления
 */
export const useMasters = (): {
  masters: EmployeeType[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  // Используем useApi для загрузки данных
  const { data, loading, error, refetch } = useApi<EmployeesApiResponse>(
    mastersEndpoint,
    { method: 'GET' },
    {
      autoLoad: true,
    }
  );

  // Извлекаем мастеров из ответа
  const masters: EmployeeType[] = data?.data || [];

  return {
    masters,
    loading,
    error,
    refetch,
  };
};