import { getMenu } from '@api/menuApi';
import { useState, useCallback, useEffect, useRef } from 'react';
import { TFoodMenuDayResponse } from 'src/types/foodMenu.types';

/**
 * Интерфейс возвращаемых значений хука useMenuDisplay
 */
interface UseMenuDisplayReturn {
  // Данные
  menu: TFoodMenuDayResponse[]; // Отсортированное меню
  isLoading: boolean; // Состояние загрузки
  error: string | null; // Сообщение об ошибке

  // Методы
  formatPrice: (price: number) => string; // Форматирование цены
  isToday: (dateString: string) => boolean; // Проверка на сегодня
  handlePrint: () => void; // Печать меню
  refetchMenu: () => void; // Перезагрузка данных
  clearError: () => void; // Очистка ошибки
}

/**
 * Хук для управления данными меню
 *
 * Основные функции:
 * 1. Загрузка данных с сервера
 * 2. Сортировка дней по возрастанию даты
 * 3. Обработка ошибок
 * 4. Управление состоянием загрузки
 * 5. Вспомогательные методы для форматирования и проверки
 */
export const useMenuDisplay = (): UseMenuDisplayReturn => {
  // === СОСТОЯНИЯ ===
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuData, setMenuData] = useState<TFoodMenuDayResponse[]>([]);
  const isFetchingRef = useRef(false); // Защита от множественных запросов

  /**
   * Вспомогательная функция для парсинга даты в формате DD.MM.YY
   *
   * @param dateStr - строка даты в формате "DD.MM.YY"
   * @returns объект Date
   *
   * @example
   * parseDate('31.08.26') // Date(2026, 7, 31)
   */
  const parseDate = useCallback((dateStr: string): Date => {
    const [day, month, year] = dateStr.split('.');
    // Добавляем 2000 к году (так как год двузначный)
    // Например: '26' → 2026
    return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
  }, []);

  /**
   * Сортировка дней меню по возрастанию даты
   *
   * @param days - массив дней с полем date
   * @returns отсортированный массив (создаёт новую копию)
   *
   * @example
   * sortDaysByDate([
   *   { date: '07.09.26', ... },
   *   { date: '31.08.26', ... },
   *   { date: '01.09.26', ... }
   * ])
   * // Результат: 31.08 → 01.09 → 07.09
   */
  const sortDaysByDate = useCallback(
    (days: TFoodMenuDayResponse[]): TFoodMenuDayResponse[] => {
      return [...days].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA.getTime() - dateB.getTime(); // Сортировка по возрастанию
      });
    },
    [parseDate] // useCallback для мемоизации
  );

  /**
   * Основная функция загрузки данных
   *
   * Логика работы:
   * 1. Устанавливаем флаг загрузки
   * 2. Получаем данные с сервера через API
   * 3. Сортируем дни по дате
   * 4. Сохраняем в состояние
   * 5. Обрабатываем ошибки
   */
  const loadData = useCallback(async () => {
    // Защита от повторных запросов
    if (isFetchingRef.current) return;

    setIsLoading(true);
    setError(null);
    isFetchingRef.current = true;

    try {
      // Получаем данные с сервера
      const response = await getMenu();

      if (response.success && response.data) {
        // === ГЛАВНОЕ: СОРТИРОВКА ДАННЫХ ===
        // Сортируем дни по возрастанию даты перед сохранением
        const sortedDays = sortDaysByDate(response.data.days);

        // Сохраняем отсортированные данные в состояние
        setMenuData(sortedDays);
      } else {
        // Обработка ошибки от сервера
        setError(response.message || 'Не удалось загрузить меню');
      }
    } catch (error) {
      // Обработка ошибок сети или парсинга
      const errorMessage = (error as Error).message || 'Неизвестная ошибка';
      setError(`Ошибка загрузки меню: ${errorMessage}`);
      console.error('Error loading menu:', error);
    } finally {
      // Обязательно сбрасываем флаги
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  }, [sortDaysByDate]); // Зависимость: sortDaysByDate (мемоизирован)

  /**
   * Загрузка данных при монтировании компонента
   *
   * useEffect с пустым массивом зависимостей означает,
   * что загрузка произойдёт только один раз
   */
  useEffect(() => {
    loadData();
  }, [loadData]); // loadData мемоизирован через useCallback

  /**
   * Форматирование цены в читаемый вид
   *
   * @param price - число (цена)
   * @returns отформатированная строка
   *
   * @example
   * formatPrice(3.09) // "3,09"
   * formatPrice(18.9) // "18,90"
   * formatPrice(0) // "—"
   */
  const formatPrice = useCallback((price: number): string => {
    if (price === 0) return '—';

    // Форматируем с двумя знаками после запятой
    return price
      .toFixed(2) // "3.09" → "3.09", "18.9" → "18.90"
      .replace('.', ',') // "3.09" → "3,09"
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' '); // "1000" → "1 000"
  }, []);

  /**
   * Проверка, является ли дата сегодняшней
   *
   * @param dateString - строка даты в формате "DD.MM.YY"
   * @returns true если дата совпадает с сегодняшним днём
   *
   * @example
   * isToday('02.09.26') // true (если сегодня 02.09.26)
   * isToday('01.09.26') // false
   */
  const isToday = useCallback((dateString: string): boolean => {
    // Получаем сегодняшнюю дату
    const today = new Date();

    // Форматируем сегодня в "DD.MM.YY"
    const todayFormatted = today
      .toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      })
      .replace(/\./g, '.'); // Убеждаемся, что разделитель - точка

    // Сравниваем строки
    return dateString === todayFormatted;
  }, []);

  /**
   * Функция для печати меню
   *
   * Использует нативное окно печати браузера
   * Стили для печати задаются в CSS через @media print
   */
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  /**
   * Функция для повторной загрузки меню
   *
   * Используется при ошибках или по нажатию кнопки "Обновить"
   * Защищена от множественных вызовов через isFetchingRef
   */
  const refetchMenu = useCallback(async () => {
    // Защита от двойного клика или множественных вызовов
    if (isFetchingRef.current) return;

    try {
      await loadData();
    } catch (error) {
      console.error('Error refetching menu:', error);
    }
  }, [loadData]); // Зависимость: loadData (мемоизирован)

  /**
   * Функция для очистки ошибки
   *
   * Используется при закрытии Alert компонента
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Возвращаем данные и методы
   *
   * menu - уже отсортированные данные
   * Все методы мемоизированы для оптимизации
   */
  return {
    // Данные
    menu: menuData, // ← ОТСОРТИРОВАННЫЕ ДАННЫЕ!
    isLoading,
    error,

    // Методы
    formatPrice,
    isToday,
    handlePrint,
    refetchMenu,
    clearError,
  };
};
