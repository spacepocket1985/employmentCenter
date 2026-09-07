// Menu API
export {
  BaseUrl,
  MenuMainEndpoint,
  WeekMenuEndpoint,
  getMenu,
  getMenuStatus,
  uploadMenu,
  clearMenu,
} from './menuApi';

// MealDeal API
export {
  getBalancedMealDeal,
  getRandomMealDeal,
  getEconomyMealDeal,
  getHeartyMealDeal,
  getVeggieMealDeal,
  getFishMealDeal,
  getMealDealByType,
} from './mealDealApi';

// Types
export type {
  IMealDealItem,
  IMealDealResponse,
  TMealDealType,
  IMealDealTypeConfig,
} from 'src/types/mealDeal.types';

export {
  MEAL_DEAL_TYPES,
  getMealDealTypeConfig,
  getMealDealTypes,
} from 'src/types/mealDeal.types';
