import { MenuModel } from '../models/menu.model';
import { IDish, TDishCategory } from '../types/menu.types';
import { DateUtils } from '../utils/dateUtils';

export type TMealDealItem = {
  name: string;
  price: number;
  weight: string;
  id1C?: string;
  unit1C?: string;
  category?: TDishCategory;
};

export type TMealDealResponse = {
  date: string;
  items: TMealDealItem[];
  totalPrice: number;
  totalWeight?: number;
  type: 'balanced' | 'economy' | 'hearty' | 'veggie' | 'fish';
};

export class MealDealService {
  /**
   * Получить сбалансированный обед (случайный)
   */
  async getBalancedMealDeal(
    dateStr?: string
  ): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    const soup = this.getRandomDish(dishes, 'soups');
    const main = this.getRandomDish(dishes, ['meat', 'poultry', 'fish']);
    const side = this.getRandomDish(dishes, 'sides');
    const salad = this.getRandomDish(dishes, 'salads');

    const items = [soup, main, side, salad].filter(
      (item): item is TMealDealItem => item !== null
    );
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    return {
      date,
      items,
      totalPrice,
      type: 'balanced',
    };
  }

  /**
   * Получить случайный обед (рефетч) — то же что balanced, но каждый раз новый
   */
  async getRandomMealDeal(dateStr?: string): Promise<TMealDealResponse | null> {
    return this.getBalancedMealDeal(dateStr);
  }

  /**
   * Получить эконом обед (самые дешевые блюда)
   */
  async getEconomyMealDeal(
    dateStr?: string
  ): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    const soup = this.getCheapestDish(dishes, 'soups');
    const main = this.getCheapestDish(dishes, ['meat', 'poultry', 'fish']);
    const side = this.getCheapestDish(dishes, 'sides');
    const salad = this.getCheapestDish(dishes, 'salads');

    const items = [soup, main, side, salad].filter(
      (item): item is TMealDealItem => item !== null
    );
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    return {
      date,
      items,
      totalPrice,
      type: 'economy',
    };
  }

  /**
   * Получить сытный обед (самые большие порции)
   */
  async getHeartyMealDeal(dateStr?: string): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    const soup = this.getHeaviestDish(dishes, 'soups');
    const main = this.getHeaviestDish(dishes, ['meat', 'poultry', 'fish']);
    const side = this.getHeaviestDish(dishes, 'sides');
    const salad = this.getHeaviestDish(dishes, 'salads');

    const items = [soup, main, side, salad].filter(
      (item): item is TMealDealItem => item !== null
    );
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const totalWeight = items.reduce(
      (sum, item) => sum + this.parseWeight(item.weight),
      0
    );

    return {
      date,
      items,
      totalPrice,
      totalWeight,
      type: 'hearty',
    };
  }

  /**
   * Получить вегетарианский обед (без мяса и рыбы)
   */
  async getVeggieMealDeal(dateStr?: string): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    const soup = this.getRandomDish(dishes, 'soups');
    const side = this.getRandomDish(dishes, 'sides');
    const salad = this.getRandomDish(dishes, 'salads');

    const items = [soup, side, salad].filter(
      (item): item is TMealDealItem => item !== null
    );
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    return {
      date,
      items,
      totalPrice,
      type: 'veggie',
    };
  }

  /**
   * Получить рыбный обед
   */
  async getFishMealDeal(dateStr?: string): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    const fish = this.getRandomDish(dishes, 'fish');
    const side = this.getRandomDish(dishes, 'sides');
    const salad = this.getRandomDish(dishes, 'salads');

    const items = [fish, side, salad].filter(
      (item): item is TMealDealItem => item !== null
    );
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

    return {
      date,
      items,
      totalPrice,
      type: 'fish',
    };
  }

  // ========== ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ ==========

  private getToday(): string {
    return DateUtils.formatDate(new Date());
  }

  private getDishesByCategory(
    dishes: IDish[],
    categories: TDishCategory | TDishCategory[]
  ): IDish[] {
    const categoryList = Array.isArray(categories) ? categories : [categories];
    return dishes.filter(
      (dish) => dish.category && categoryList.includes(dish.category)
    );
  }

  private getRandomDish(
    dishes: IDish[],
    categories: TDishCategory | TDishCategory[]
  ): TMealDealItem | null {
    const filtered = this.getDishesByCategory(dishes, categories);
    if (filtered.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filtered.length);
    const dish = filtered[randomIndex];

    return this.toMealDealItem(dish);
  }

  private getCheapestDish(
    dishes: IDish[],
    categories: TDishCategory | TDishCategory[]
  ): TMealDealItem | null {
    const filtered = this.getDishesByCategory(dishes, categories);
    if (filtered.length === 0) return null;

    const cheapest = filtered.reduce((min, current) =>
      current.price < min.price ? current : min
    );

    return this.toMealDealItem(cheapest);
  }

  private getHeaviestDish(
    dishes: IDish[],
    categories: TDishCategory | TDishCategory[]
  ): TMealDealItem | null {
    const filtered = this.getDishesByCategory(dishes, categories);
    if (filtered.length === 0) return null;

    const heaviest = filtered.reduce((max, current) => {
      const maxWeight = this.parseWeight(max.weight);
      const currentWeight = this.parseWeight(current.weight);
      return currentWeight > maxWeight ? current : max;
    });

    return this.toMealDealItem(heaviest);
  }

  private toMealDealItem(dish: IDish): TMealDealItem {
    return {
      name: dish.name,
      price: dish.price,
      weight: dish.weight,
      id1C: dish.id1C,
      unit1C: dish.unit1C,
      category: dish.category,
    };
  }

  private parseWeight(weightStr: string): number {
    if (!weightStr) return 0;
    const match = weightStr.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
}

export const mealDealService = new MealDealService();
