import { getMenu } from '@api/menuApi';
import { useState, useCallback, useEffect, useRef } from 'react';

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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuData, setMenuData] = useState<Menu>([]);

  const loadData = async () => {
    setIsLoading(true);

    try {
      const response = await getMenu();

      if (response.success && response.data) {
        setMenuData(response.data);
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
    menu: menuData || [],
    isLoading,
    error,
    formatPrice,
    isToday,
    handlePrint,
    refetchMenu,
    clearError,
  };
};
