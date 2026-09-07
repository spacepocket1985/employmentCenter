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
  isChefRecommend?: boolean;
};

export type TMealDealResponse = {
  date: string;
  items: TMealDealItem[];
  totalPrice: number;
  totalWeight?: number;
  type:
    | 'balanced'
    | 'economy'
    | 'hearty'
    | 'veggie'
    | 'fish'
    | 'culinary'
    | 'chefChoice';
};

export class MealDealService {
  /**
   * Получить сбалансированный обед (случайный)
   * Включает: суп, основное (мясо/птица/рыба), гарнир, салат
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
   * Получить "Выбор шефа"
   * Использует ТОЛЬКО блюда с флагом isChefRecommend
   * Если в категории нет рекомендованных блюд - категория пропускается
   */
  async getChefChoiceMealDeal(
    dateStr?: string
  ): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    // Получаем ТОЛЬКО рекомендованные блюда по категориям
    const soup = this.getChefRecommendDish(dishes, 'soups');
    const main = this.getChefRecommendDish(dishes, ['meat', 'poultry', 'fish']);
    const side = this.getChefRecommendDish(dishes, 'sides');
    const salad = this.getChefRecommendDish(dishes, 'salads');
    const culinary = this.getChefRecommendDish(dishes, 'culinary');

    // Собираем только те блюда, которые есть (не null)
    const items = [soup, main, side, salad, culinary].filter(
      (item): item is TMealDealItem => item !== null
    );

    // Если нет ни одного рекомендованного блюда - возвращаем null
    if (items.length === 0) {
      return null;
    }

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
      type: 'chefChoice',
    };
  }

  /**
   * Получить вегетарианский обед (без мяса и рыбы)
   * Включает: суп, гарнир, салат
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
   * Включает: рыба, гарнир, салат
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

  /**
   * Получить "Кулинарный" обед (только выпечка и десерты)
   */
  async getCulinaryMealDeal(
    dateStr?: string
  ): Promise<TMealDealResponse | null> {
    const date = dateStr || this.getToday();
    const menu = await MenuModel.findOne({ date });

    if (!menu) {
      return null;
    }

    const dishes = menu.dishes as IDish[];

    // Выбираем 2-3 блюда из culinary
    const culinaryDishes = this.getDishesByCategory(dishes, 'culinary');

    if (culinaryDishes.length === 0) {
      return null;
    }

    // Берем случайные 2-3 блюда (или все, если их меньше)
    const count = Math.min(culinaryDishes.length, 3);
    const shuffled = this.shuffleArray(culinaryDishes);
    const selected = shuffled.slice(0, count);

    const items = selected.map((dish) => this.toMealDealItem(dish));
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
      type: 'culinary',
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

  /**
   * Получить ТОЛЬКО рекомендованное блюдо из категории
   * Возвращает null, если нет блюд с isChefRecommend
   */
  private getChefRecommendDish(
    dishes: IDish[],
    categories: TDishCategory | TDishCategory[]
  ): TMealDealItem | null {
    const categoryList = Array.isArray(categories) ? categories : [categories];

    // Фильтруем только рекомендованные блюда
    const recommended = dishes.filter(
      (dish) =>
        dish.category &&
        categoryList.includes(dish.category) &&
        dish.isChefRecommend === true
    );

    // Если нет рекомендованных блюд - возвращаем null
    if (recommended.length === 0) {
      return null;
    }

    // Берем случайное рекомендованное блюдо
    const randomIndex = Math.floor(Math.random() * recommended.length);
    return this.toMealDealItem(recommended[randomIndex]);
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
      isChefRecommend: dish.isChefRecommend,
    };
  }

  private parseWeight(weightStr: string): number {
    if (!weightStr) return 0;
    const match = weightStr.match(/^(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

export const mealDealService = new MealDealService();
