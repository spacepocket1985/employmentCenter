import { IMealDealResponse, TMealDealType } from 'src/types/mealDeal.types';
import { ApiResponse } from 'src/types/menu.types';
import { BaseUrl, MenuMainEndpoint } from './menuApi';

/**
 * Базовый URL для эндпоинтов MealDeal
 */
const MEAL_DEAL_BASE = `${BaseUrl}/${MenuMainEndpoint}/meal-deal`;

/**
 * Вспомогательная функция для запросов к MealDeal API
 */
async function mealDealRequest<T = IMealDealResponse>(
  endpoint: string,
  date?: string
): Promise<ApiResponse<T>> {
  const url = `${MEAL_DEAL_BASE}${endpoint}${date ? `?date=${date}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка сервера');
    }

    return data;
  } catch (error) {
    console.error('MealDeal API Error:', error);
    return {
      success: false,
      message: (error as Error).message || 'Ошибка сети',
      errors: [(error as Error).message],
    };
  }
}

/**
 * Получить сбалансированный обед
 */
export async function getBalancedMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('', date);
}

/**
 * Получить случайный обед
 */
export async function getRandomMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('/random', date);
}

/**
 * Получить эконом обед
 */
export async function getEconomyMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('/economy', date);
}

/**
 * Получить сытный обед
 */
export async function getHeartyMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('/hearty', date);
}

/**
 * Получить вегетарианский обед
 */
export async function getVeggieMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('/veggie', date);
}

/**
 * Получить рыбный обед
 */
export async function getFishMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('/fish', date);
}

/**
 * Получить набор шефа
 */
export async function getChefMealDeal(
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  return mealDealRequest<IMealDealResponse>('/chef', date);
}

/**
 * Получить обед по типу
 */
export async function getMealDealByType(
  type: TMealDealType,
  date?: string
): Promise<ApiResponse<IMealDealResponse>> {
  switch (type) {
    case 'balanced':
      return getBalancedMealDeal(date);
    // case 'random':
    //   return getRandomMealDeal(date);
    case 'economy':
      return getEconomyMealDeal(date);
    case 'hearty':
      return getHeartyMealDeal(date);
    case 'veggie':
      return getVeggieMealDeal(date);
    case 'fish':
      return getFishMealDeal(date);
    case 'chef':
      return getChefMealDeal(date);
    default:
      return getBalancedMealDeal(date);
  }
}
