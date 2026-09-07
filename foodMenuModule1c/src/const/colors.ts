/**
 * Цветовая палитра T4 Design System
 */
export const T4_COLORS = {
  // Основные цвета
  primary: '#103896',
  indigo: '#020202',
  purple: '#6f42c1',
  pink: '#d63384',
  red: '#dc3545',
  orange: '#fd7e14',
  yellow: '#ffc107',
  green: '#198754',
  teal: '#20c997',
  cyan: '#0dcaf0',

  // Оттенки серого
  white: '#ffffff',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd',
  gray600: '#6c757d',
  gray700: '#495057',
  gray800: '#343a40',
  gray900: '#212529',

  // Семантические цвета
  success: '#198754',
  info: '#0dcaf0',
  warning: '#ffc107',
  danger: '#dc3545',
  light: '#f8f9fa',
  dark: '#212529',
  secondary: '#6c757d',
} as const;

/**
 * Тип для цветов T4 (только значения)
 */
export type T4Color = (typeof T4_COLORS)[keyof typeof T4_COLORS];

/**
 * Тип для ключей цветов T4
 */
export type T4ColorKey = keyof typeof T4_COLORS;

/**
 * Вспомогательная функция для преобразования HEX в RGBA с прозрачностью
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  // Убираем # если есть
  const cleanHex = hex.replace('#', '');

  // Парсим RGB компоненты
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Получает цвет с прозрачностью
 */
export const getColorWithOpacity = (
  color: T4Color,
  opacity: number
): string => {
  return hexToRgba(color, opacity);
};
