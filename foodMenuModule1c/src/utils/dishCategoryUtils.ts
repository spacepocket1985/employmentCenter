import { TDishCategory } from 'src/types/foodMenu.types';

import { SvgIconProps } from '@mui/material/SvgIcon';
import { isDeprecatedCategory, getCategoryConfig } from '@const/categoryConfig';
import { T4Color, getColorWithOpacity, T4_COLORS } from '@const/colors';

type IconComponent = React.ElementType<SvgIconProps>;

/**
 * Получает название категории на русском для отображения
 * Поддерживает обратную совместимость для старых категорий
 */
export const getCategoryLabel = (
  category: TDishCategory | string | undefined | null
): string => {
  // Если категория не определена, возвращаем "Прочее"
  if (!category) {
    return 'Прочее';
  }

  // Обратная совместимость для старых данных
  if (isDeprecatedCategory(category)) {
    return 'Кулинария';
  }
  return getCategoryConfig(category).label;
};

/**
 * Получает иконку для категории
 */
export const getCategoryIcon = (
  category: TDishCategory | string | undefined | null
): IconComponent => {
  // Если категория не определена, возвращаем иконку для other
  if (!category) {
    return getCategoryConfig('other').icon;
  }

  // Обратная совместимость для старых данных
  if (isDeprecatedCategory(category)) {
    return getCategoryConfig('culinary').icon;
  }
  return getCategoryConfig(category).icon;
};

/**
 * Получает цвет для категории
 */
export const getCategoryColor = (
  category: TDishCategory | string | undefined | null
): T4Color => {
  // Если категория не определена, возвращаем цвет для other
  if (!category) {
    return getCategoryConfig('other').color;
  }

  // Обратная совместимость для старых данных
  if (isDeprecatedCategory(category)) {
    return getCategoryConfig('culinary').color;
  }
  return getCategoryConfig(category).color;
};

/**
 * Получает фоновый цвет для категории с прозрачностью
 */
export const getCategoryBackgroundColor = (
  category: TDishCategory | string | undefined | null
): string => {
  // Если категория не определена, возвращаем цвет для other
  if (!category) {
    const config = getCategoryConfig('other');
    const opacity = config.bgOpacity ?? 0.1;
    return getColorWithOpacity(config.color, opacity);
  }

  // Обратная совместимость для старых данных
  if (isDeprecatedCategory(category)) {
    const config = getCategoryConfig('culinary');
    const opacity = config.bgOpacity ?? 0.1;
    return getColorWithOpacity(config.color, opacity);
  }

  const config = getCategoryConfig(category);
  const opacity = config.bgOpacity ?? 0.1;
  return getColorWithOpacity(config.color, opacity);
};

/**
 * Получает цвет для границы категории с прозрачностью
 */
export const getCategoryBorderColor = (
  category: TDishCategory | string | undefined | null
): string => {
  // Если категория не определена, возвращаем цвет для other
  if (!category) {
    const config = getCategoryConfig('other');
    const opacity = config.borderOpacity ?? 0.3;
    return getColorWithOpacity(config.color, opacity);
  }

  // Обратная совместимость для старых данных
  if (isDeprecatedCategory(category)) {
    const config = getCategoryConfig('culinary');
    const opacity = config.borderOpacity ?? 0.3;
    return getColorWithOpacity(config.color, opacity);
  }

  const config = getCategoryConfig(category);
  const opacity = config.borderOpacity ?? 0.3;
  return getColorWithOpacity(config.color, opacity);
};

/**
 * Проверяет, является ли цвет темным
 */
const isDarkColor = (color: T4Color): boolean => {
  const darkColors: T4Color[] = [
    T4_COLORS.primary,
    T4_COLORS.purple,
    T4_COLORS.red,
    T4_COLORS.green,
    T4_COLORS.gray600,
    T4_COLORS.gray700,
    T4_COLORS.gray800,
    T4_COLORS.gray900,
    T4_COLORS.indigo,
    T4_COLORS.pink,
    T4_COLORS.dark,
  ];

  return darkColors.includes(color);
};

/**
 * Получает цвет для текста на фоне категории
 * Для темных цветов используем белый, для светлых - темный
 */
export const getCategoryTextColor = (
  category: TDishCategory | string | undefined | null
): string => {
  const color = getCategoryColor(category);
  return isDarkColor(color) ? T4_COLORS.white : T4_COLORS.gray900;
};

/**
 * Стили категории
 */
export interface CategoryStyles {
  color: T4Color;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

/**
 * Получает все стили для категории
 * С поддержкой обратной совместимости
 */
export const getCategoryStyles = (
  category: TDishCategory | string | undefined | null
): CategoryStyles => {
  const color = getCategoryColor(category);
  const bgColor = getCategoryBackgroundColor(category);
  const textColor = getCategoryTextColor(category);
  const borderColor = getCategoryBorderColor(category);

  return {
    color,
    bgColor,
    textColor,
    borderColor,
  };
};

/**
 * Проверяет, является ли категория валидной
 */
export const isValidCategory = (
  category: string | undefined | null
): boolean => {
  // Если категория не определена, возвращаем false
  if (!category) {
    return false;
  }

  const validCategories: TDishCategory[] = [
    'dairy',
    'drinks',
    'soups',
    'sides',
    'salads',
    'meat',
    'fish',
    'poultry',
    'culinary',
    'other',
  ];

  // Проверяем точное совпадение
  if (validCategories.includes(category as TDishCategory)) {
    return true;
  }

  // Проверяем, не является ли устаревшей
  if (isDeprecatedCategory(category)) {
    return true; // Устаревшие категории считаем валидными (для обратной совместимости)
  }

  return false;
};

/**
 * Получает все доступные категории
 */
export const getAllCategories = (): TDishCategory[] => {
  return [
    'dairy',
    'drinks',
    'soups',
    'sides',
    'salads',
    'meat',
    'fish',
    'poultry',
    'culinary',
    'other',
  ];
};

/**
 * Преобразует категорию в актуальную (для миграции)
 * Если категория устаревшая, возвращает culinary
 * Если категория undefined или null, возвращает other
 */
export const migrateCategory = (
  category: string | undefined | null
): TDishCategory => {
  // Если категория не определена, возвращаем other
  if (!category) {
    return 'other';
  }

  // Если категория устаревшая, возвращаем culinary
  if (isDeprecatedCategory(category)) {
    return 'culinary';
  }

  // Проверяем, является ли категория валидной
  if (isValidCategory(category)) {
    return category as TDishCategory;
  }

  // Если ничего не подошло, возвращаем other
  return 'other';
};
