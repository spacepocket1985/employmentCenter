import { TDishCategory } from 'src/types/foodMenu.types';
import {
  Coffee as CoffeeIcon,
  SoupKitchen as SoupKitchenIcon,
  RamenDining as RamenDiningIcon,
  Grass as GrassIcon,
  LunchDining as LunchDiningIcon,
  SetMeal as SetMealIcon,
  Fastfood as FastfoodIcon,
  BakeryDining as BakeryDiningIcon,
  Cake as CakeIcon,
  LocalDining as LocalDiningIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

// Используем React.ElementType для хранения компонентов иконок
type IconComponent = React.ElementType<SvgIconProps>;

/**
 * Получает название категории на русском для отображения
 */
export const getCategoryLabel = (category: TDishCategory): string => {
  const labels: Record<TDishCategory, string> = {
    dairy: 'Молочные блюда',
    drinks: 'Напитки',
    soups: 'Супы',
    sides: 'Гарниры',
    salads: 'Салаты',
    meat: 'Мясные блюда',
    fish: 'Рыбные блюда',
    poultry: 'Блюда из птицы',
    baking: 'Выпечка',
    desserts: 'Десерты',
    other: 'Прочее',
  };
  return labels[category] || 'Прочее';
};

/**
 * Получает иконку для категории (возвращает компонент иконки)
 */
export const getCategoryIcon = (category: TDishCategory): IconComponent => {
  const icons: Record<TDishCategory, IconComponent> = {
    dairy: LocalDiningIcon,
    drinks: CoffeeIcon,
    soups: SoupKitchenIcon,
    sides: RamenDiningIcon,
    salads: GrassIcon,
    meat: LunchDiningIcon,
    fish: SetMealIcon,
    poultry: SetMealIcon,
    baking: BakeryDiningIcon,
    desserts: CakeIcon,
    other: FastfoodIcon,
  };
  return icons[category] || CategoryIcon;
};

/**
 * Получает цвет для категории
 */
export const getCategoryColor = (category: TDishCategory): string => {
  const colors: Record<TDishCategory, string> = {
    dairy: '#7cb342', // Зеленый
    drinks: '#29b6f6', // Голубой
    soups: '#ff8a65', // Оранжевый
    sides: '#ffa726', // Янтарный
    salads: '#66bb6a', // Светло-зеленый
    meat: '#ef5350', // Красный
    fish: '#42a5f5', // Синий
    poultry: '#ab47bc', // Фиолетовый
    baking: '#ffb74d', // Желтый
    desserts: '#ec407a', // Розовый
    other: '#bdbdbd', // Серый
  };
  return colors[category] || '#bdbdbd';
};

/**
 * Получает фоновый цвет для категории
 */
export const getCategoryBackgroundColor = (category: TDishCategory): string => {
  const colors: Record<TDishCategory, string> = {
    dairy: '#f1f8e9',
    drinks: '#e1f5fe',
    soups: '#fbe9e7',
    sides: '#fff3e0',
    salads: '#e8f5e9',
    meat: '#ffebee',
    fish: '#e3f2fd',
    poultry: '#f3e5f5',
    baking: '#fff8e1',
    desserts: '#fce4ec',
    other: '#f5f5f5',
  };
  return colors[category] || '#f5f5f5';
};
