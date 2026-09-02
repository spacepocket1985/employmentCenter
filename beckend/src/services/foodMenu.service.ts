import { IMenuDocument, IDish } from '../types/menu.types';
import {
  TFoodMenuDayResponse,
  TFoodMenuPeriodResponse,
  TFoodMenuByDateResponse,
} from '../types/foodMenu.types';
import {
  menuPeriodCache,
  menuDateCache,
} from '../utils/cache/entities/menu.cache';
import { sortDishesByCategory } from '../utils/dishCategory';
import { MenuModel } from '../models/menu.model';

export class FoodMenuService {
  /**
   * Получить меню на конкретную дату
   */
  async getMenuByDate(
    dateStr: string
  ): Promise<TFoodMenuByDateResponse | null> {
    const cacheKey = `date:${dateStr}`;

    // Проверяем кэш для дат
    const cached = menuDateCache.get(cacheKey);
    if (cached !== null) {
      console.log(`📦 Кэш (дата): ${cacheKey}`);
      return cached;
    }

    const normalizedDate = this.normalizeDate(dateStr);
    if (!normalizedDate) {
      throw new Error('Неверный формат даты');
    }

    const menu = await MenuModel.findOne({ date: normalizedDate });

    if (!menu) {
      menuDateCache.set(cacheKey, null);
      return null;
    }

    // Сортируем блюда по категориям
    const sortedDishes = sortDishesByCategory(menu.dishes as IDish[]);

    const result: TFoodMenuByDateResponse = {
      date: menu.date,
      dayOfWeek: menu.dayOfWeek,
      dishes: sortedDishes,
      count: sortedDishes.length,
    };

    menuDateCache.set(cacheKey, result);
    return result;
  }

  /**
   * Получить меню на текущую неделю (пн-пт)
   */
  async getCurrentWeekMenu(): Promise<TFoodMenuPeriodResponse> {
    const { start, end } = this.getCurrentWeekRange();
    const cacheKey = `week:${this.formatDateKey(start)}:${this.formatDateKey(
      end
    )}`;

    // Проверяем кэш для периодов
    const cached = menuPeriodCache.get(cacheKey);
    if (cached !== null) {
      console.log(`📦 Кэш (период): ${cacheKey}`);
      return cached;
    }

    const result = await this.getMenuByPeriod(start, end);
    menuPeriodCache.set(cacheKey, result);
    return result;
  }

  /**
   * Получить меню с понедельника по следующий понедельник
   */
  async getFullWeekMenu(): Promise<TFoodMenuPeriodResponse> {
    const { start, end } = this.getFullWeekRange();
    const cacheKey = `fullweek:${this.formatDateKey(
      start
    )}:${this.formatDateKey(end)}`;

    // Проверяем кэш для периодов
    const cached = menuPeriodCache.get(cacheKey);
    if (cached !== null) {
      console.log(`📦 Кэш (период): ${cacheKey}`);
      return cached;
    }

    const result = await this.getMenuByPeriod(start, end);
    menuPeriodCache.set(cacheKey, result);
    return result;
  }

  /**
   * Получить меню за период
   */
  async getMenuByPeriod(
    dateFrom: Date,
    dateTo: Date
  ): Promise<TFoodMenuPeriodResponse> {
    // Генерируем все даты в диапазоне
    const dates: string[] = [];
    const current = new Date(dateFrom);

    while (current <= dateTo) {
      dates.push(this.formatDateKey(current));
      current.setDate(current.getDate() + 1);
    }

    console.log(`📅 Поиск по датам (${dates.length} шт)`);

    const menus = await MenuModel.find({
      date: { $in: dates },
    }).sort({ date: 1 });

    console.log(`📊 Найдено записей в MongoDB: ${menus.length}`);

    const days: TFoodMenuDayResponse[] = menus.map((menu: IMenuDocument) => ({
      date: menu.date,
      dayOfWeek: menu.dayOfWeek,
      dishes: sortDishesByCategory(menu.dishes as IDish[]),
      count: menu.dishes.length,
    }));

    const totalDishes = days.reduce((sum, day) => sum + day.count, 0);

    return {
      period: {
        from: this.formatDateKey(dateFrom),
        to: this.formatDateKey(dateTo),
      },
      days,
      totalDays: days.length,
      totalDishes,
    };
  }

  /**
   * Очистить весь кэш меню
   */
  clearCache(): void {
    menuPeriodCache.clear();
    menuDateCache.clear();
    console.log('🗑️ Кэш меню очищен');
  }

  /**
   * Получить диапазон текущей недели (пн-пт)
   */
  private getCurrentWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const day = now.getDay();

    const diff = (day === 0 ? 7 : day) - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);
    friday.setHours(23, 59, 59, 999);

    return { start: monday, end: friday };
  }

  /**
   * Получить диапазон с понедельника по следующий понедельник
   */
  private getFullWeekRange(): { start: Date; end: Date } {
    const now = new Date();
    const day = now.getDay();

    const diff = (day === 0 ? 7 : day) - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    nextMonday.setHours(23, 59, 59, 999);

    return { start: monday, end: nextMonday };
  }

  /**
   * Форматирует дату для ключа в БД (ДД.ММ.ГГ)
   */
  private formatDateKey(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(2);
    return `${day}.${month}.${year}`;
  }

  /**
   * Нормализует дату из разных форматов в ДД.ММ.ГГ
   */
  private normalizeDate(dateStr: string): string | null {
    // Уже в формате ДД.ММ.ГГ
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // Формат ДД.ММ.ГГГГ → ДД.ММ.ГГ
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      return dateStr.slice(0, 8);
    }

    // Формат ГГГГ-ММ-ДД → ДД.ММ.ГГ
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [, month, day] = dateStr.split('-');
      const year = dateStr.slice(2, 4);
      return `${day}.${month}.${year}`;
    }

    return null;
  }
}

export const foodMenuService = new FoodMenuService();
