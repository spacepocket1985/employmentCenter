
import { cacheManager } from '../cacheManager';
import {
  TFoodMenuPeriodResponse,
  TFoodMenuByDateResponse,
} from '../../../types/foodMenu.types';

export const MENU_CACHE_TTL = 300; // 5 минут

// Кэш для периодов (неделя, полная неделя)
export const menuPeriodCache = cacheManager.register<TFoodMenuPeriodResponse>(
  'menuPeriod',
  {
    prefix: 'menu:period',
    ttlSeconds: MENU_CACHE_TTL,
  }
);

// Кэш для конкретных дат
export const menuDateCache = cacheManager.register<TFoodMenuByDateResponse | null>(
  'menuDate',
  {
    prefix: 'menu:date',
    ttlSeconds: MENU_CACHE_TTL,
  }
);

export type TMenuPeriodCache = typeof menuPeriodCache;
export type TMenuDateCache = typeof menuDateCache;