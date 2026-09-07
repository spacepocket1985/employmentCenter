import { TDishCategory } from './foodMenu.types';
import {
  Balance as BalancedIcon,
  // Shuffle as RandomIcon,
  Savings as EconomyIcon,
  FitnessCenter as HeartyIcon,
  Grass as VeggieIcon,
  SetMeal as FishIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { SvgIconProps } from '@mui/material/SvgIcon';

type IconComponent = React.ElementType<SvgIconProps>;

/**
 * Тип обеда
 * Убраны: culinary (кулинарный)
 */
export type TMealDealType =
  | 'balanced' // Сбалансированный
  // | 'random' // Случайный
  | 'economy' // Эконом
  | 'hearty' // Сытный
  | 'veggie' // Вегетарианский
  | 'fish' // Рыбный
  | 'chef'; // Набор шефа

/**
 * Элемент обеда (блюдо)
 */
export interface IMealDealItem {
  name: string;
  price: number;
  weight: string;
  id1C?: string;
  unit1C?: string;
  category?: TDishCategory;
}

/**
 * Ответ от API с обедом
 */
export interface IMealDealResponse {
  date: string;
  items: IMealDealItem[];
  totalPrice: number;
  totalWeight?: number;
  type: TMealDealType;
}

/**
 * Конфигурация типа обеда для отображения
 */
export interface IMealDealTypeConfig {
  type: TMealDealType;
  label: string;
  icon: IconComponent;
  description: string;
  color: string;
  /** Можно ли обновлять (получать другой вариант) */
  canRefresh: boolean;
}

/**
 * Конфигурация всех типов обедов
 */
export const MEAL_DEAL_TYPES: Record<TMealDealType, IMealDealTypeConfig> = {
  balanced: {
    type: 'balanced',
    label: 'Сбалансированный',
    icon: BalancedIcon,
    description: 'Суп, основное, гарнир, салат',
    color: '#1976d2',
    canRefresh: true, // ✅ Можно обновлять
  },
  chef: {
    type: 'chef',
    label: 'Выбор шефа',
    icon: StarIcon,
    description: 'Набор от шефа',
    color: '#d84315',
    canRefresh: false, // ❌ Нельзя обновлять (всегда одни и те же)
  },
  // random: {
  //   type: 'random',
  //   label: 'Случайный',
  //   icon: RandomIcon,
  //   description: 'Случайный набор блюд',
  //   color: '#9c27b0',
  //   canRefresh: true, // ✅ Можно обновлять
  // },
  economy: {
    type: 'economy',
    label: 'Эконом',
    icon: EconomyIcon,
    description: 'Самые доступные блюда',
    color: '#2e7d32',
    canRefresh: false, // ❌ Нельзя обновлять (всегда одни и те же)
  },
  hearty: {
    type: 'hearty',
    label: 'Сытный',
    icon: HeartyIcon,
    description: 'Самые большие порции',
    color: '#d84315',
    canRefresh: false, // ❌ Нельзя обновлять (всегда одни и те же)
  },
  veggie: {
    type: 'veggie',
    label: 'Вегетарианский',
    icon: VeggieIcon,
    description: 'Без мяса и рыбы',
    color: '#388e3c',
    canRefresh: true, // ✅ Можно обновлять
  },
  fish: {
    type: 'fish',
    label: 'Рыбный',
    icon: FishIcon,
    description: 'Рыба, гарнир, салат',
    color: '#0288d1',
    canRefresh: true, // ✅ Можно обновлять
  },
};

/**
 * Получить конфигурацию типа обеда
 */
export const getMealDealTypeConfig = (
  type: TMealDealType
): IMealDealTypeConfig => {
  return MEAL_DEAL_TYPES[type] || MEAL_DEAL_TYPES.balanced;
};

/**
 * Получить список всех типов обедов
 */
export const getMealDealTypes = (): TMealDealType[] => {
  return Object.keys(MEAL_DEAL_TYPES) as TMealDealType[];
};

/**
 * Проверяет, можно ли обновлять тип
 */
export const canRefreshMealDeal = (type: TMealDealType): boolean => {
  return getMealDealTypeConfig(type).canRefresh;
};
