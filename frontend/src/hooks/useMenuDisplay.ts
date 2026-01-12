import { useGetMenuDisplayQuery } from '@store/slices';
import { useState, useCallback } from 'react';

import { Menu } from 'src/types/menu.types';

interface UseMenuDisplayReturn {
  // Данные
  menu: Menu;
  isLoading: boolean;
  error: string | null;

  // Методы
  formatPrice: (price: number) => string;
  isToday: (dateString: string) => boolean;
  handlePrint: () => void;
  refetchMenu: () => void;
  clearError: () => void;
}

export const useMenuDisplay = (): UseMenuDisplayReturn => {
  // Используем RTK Query
  const {
    data: response,
    isLoading,
    error: rtkError,
    refetch,
  } = useGetMenuDisplayQuery();

  const [error, setError] = useState<string | null>(null);

  // Обработка ошибок
  if (rtkError && !error) {
    const errorMessage =
      'data' in rtkError
        ? (rtkError.data as { message?: string })?.message ||
          'Не удалось загрузить меню'
        : 'Ошибка при загрузке меню';
    setError(errorMessage);
  }

  // Форматирование цены
  const formatPrice = useCallback((price: number): string => {
    if (price === 0) return '—';
    return price
      .toFixed(2)
      .replace('.', ',')
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }, []);

  // Проверка, является ли дата сегодняшней
  const isToday = useCallback((dateString: string): boolean => {
    const today = new Date();
    const todayFormatted = today
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
      .replace(/\./g, '.');

    return dateString === todayFormatted;
  }, []);

  // Печать меню
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Перезагрузка меню
  const refetchMenu = useCallback(async () => {
    try {
      await refetch().unwrap();
      setError(null);
    } catch (err) {
      setError('Не удалось обновить меню');
    }
  }, [refetch]);

  // Очистка ошибки
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    menu: response?.data || [],
    isLoading,
    error,
    formatPrice,
    isToday,
    handlePrint,
    refetchMenu,
    clearError,
  };
};
