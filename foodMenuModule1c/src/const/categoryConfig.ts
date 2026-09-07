import { TDishCategory } from 'src/types/foodMenu.types';
import { T4_COLORS, T4Color } from './colors';
import {
  Coffee as CoffeeIcon,
  SoupKitchen as SoupKitchenIcon,
  RamenDining as RamenDiningIcon,
  Grass as GrassIcon,
  LunchDining as LunchDiningIcon,
  SetMeal as SetMealIcon,
  Fastfood as FastfoodIcon,
  BakeryDining as BakeryDiningIcon,
  LocalDining as LocalDiningIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

type IconComponent = React.ElementType<SvgIconProps>;

/**
 * Конфигурация категории
 */
export interface CategoryConfig {
  /** Название категории на русском */
  label: string;
  /** Иконка категории */
  icon: IconComponent;
  /** Основной цвет категории */
  color: T4Color;
  /** Прозрачность фона (0-1) */
  bgOpacity?: number;
  /** Прозрачность границы (0-1) */
  borderOpacity?: number;
  /** Альтернативная иконка (опционально) */
  iconAlt?: IconComponent;
}

/**
 * Конфигурация всех категорий
 */
export const CATEGORY_CONFIG: Record<TDishCategory, CategoryConfig> = {
  dairy: {
    label: 'Молочные блюда',
    icon: LocalDiningIcon,
    color: T4_COLORS.green,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  drinks: {
    label: 'Напитки',
    icon: CoffeeIcon,
    color: T4_COLORS.cyan,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  soups: {
    label: 'Супы',
    icon: SoupKitchenIcon,
    color: T4_COLORS.orange,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  sides: {
    label: 'Гарниры',
    icon: RamenDiningIcon,
    color: T4_COLORS.yellow,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  salads: {
    label: 'Салаты',
    icon: GrassIcon,
    color: T4_COLORS.teal,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  meat: {
    label: 'Мясные блюда',
    icon: LunchDiningIcon,
    color: T4_COLORS.red,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  fish: {
    label: 'Рыбные блюда',
    icon: SetMealIcon,
    color: T4_COLORS.primary,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  poultry: {
    label: 'Блюда из птицы',
    icon: SetMealIcon,
    color: T4_COLORS.purple,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  culinary: {
    label: 'Кулинария',
    icon: BakeryDiningIcon,
    iconAlt: RestaurantIcon,
    color: T4_COLORS.orange,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
  other: {
    label: 'Прочее',
    icon: FastfoodIcon,
    color: T4_COLORS.gray600,
    bgOpacity: 0.1,
    borderOpacity: 0.3,
  },
};

/**
 * Устаревшие категории для обратной совместимости
 */
export const DEPRECATED_CATEGORIES = {
  baking: 'culinary' as TDishCategory,
  desserts: 'culinary' as TDishCategory,
} as const;

export type DeprecatedCategory = keyof typeof DEPRECATED_CATEGORIES;

/**
 * Проверяет, является ли категория устаревшей
 */
export const isDeprecatedCategory = (
  category: string | undefined | null
): category is DeprecatedCategory => {
  if (!category) {
    return false;
  }
  return category === 'baking' || category === 'desserts';
};

/**
 * Получить конфигурацию категории
 * С поддержкой обратной совместимости для старых категорий
 */
export const getCategoryConfig = (
  category: TDishCategory | string
): CategoryConfig => {
  // Проверяем, является ли категория устаревшей
  if (isDeprecatedCategory(category)) {
    return CATEGORY_CONFIG.culinary;
  }

  // Проверяем, существует ли категория в конфиге
  if (category in CATEGORY_CONFIG) {
    return CATEGORY_CONFIG[category as TDishCategory];
  }

  // Если категория не найдена, возвращаем other
  return CATEGORY_CONFIG.other;
};
