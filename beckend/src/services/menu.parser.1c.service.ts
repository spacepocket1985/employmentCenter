import oneCConfig from "../config/oneC.config";
import { MenuModel } from "../models/menu.model";
import { menuOneCRepository } from "../repositories/menu.1c.repository";
import { IDish } from "../types/menu.types";
import { TOneCDish, TOneCMenuItemResult } from "../types/oneC.types";
import { getDishCategory } from "../utils/dishCategory";
import { MenuDateUtils } from "../utils/menuDateUtils";


export type TParseResult = {
  success: boolean;
  message: string;
  stats: {
    totalDishes: number;
    totalDays: number;
    totalItems: number;
    matchedDishes: number;
    notFoundDishes: number;
    savedDays: number;
    dateFrom?: string;
    dateTo?: string;
  };
  errors?: string[];
};

export class MenuParserOneCService {
  async parseAndSaveMenu(): Promise<TParseResult> {
    const stats = {
      totalDishes: 0,
      totalDays: 0,
      totalItems: 0,
      matchedDishes: 0,
      notFoundDishes: 0,
      savedDays: 0,
      dateFrom: undefined as string | undefined,
      dateTo: undefined as string | undefined,
    };

    const errors: string[] = [];

    try {
      console.log('🔄 Начинаем парсинг 1С...');
      console.log('='.repeat(60));

      const now = new Date();
      const dateFrom = new Date(now);
      dateFrom.setMonth(dateFrom.getMonth() - oneCConfig.menuMonthsToLoad);
      dateFrom.setHours(0, 0, 0, 0);
      
      console.log(`📅 Загружаем данные за последние ${oneCConfig.menuMonthsToLoad} месяца`);
      
      stats.dateFrom = dateFrom.toLocaleDateString('ru-RU');
      stats.dateTo = now.toLocaleDateString('ru-RU');

      // Шаг 1: Читаем справочник блюд
      console.log('📖 Шаг 1: Чтение справочника блюд...');
      const dishes = await menuOneCRepository.getAllDishes();
      const dishesMap = new Map<string, TOneCDish>();
      for (const dish of dishes) {
        if (dish.ID) {
          dishesMap.set(dish.ID.trim(), dish);
        }
      }
      stats.totalDishes = dishesMap.size;
      console.log(`   ✅ Загружено блюд: ${dishesMap.size}`);

      // Шаг 2: Читаем журнал документов
      console.log('📖 Шаг 2: Чтение журнала документов...');
      const journal = await menuOneCRepository.getJournal(dateFrom);
      console.log(`   ✅ Загружено записей журнала: ${journal.length}`);

      // Шаг 3: Фильтруем документы ПланМеню
      console.log('📖 Шаг 3: Фильтрация документов ПланМеню...');
      const menuJournal = journal.filter(
        (j) => j.IDJOURNAL === oneCConfig.menuJournalId
      );
      console.log(`   ✅ Найдено документов ПланМеню: ${menuJournal.length}`);

      // Шаг 4: Создаем карту IDDOC -> дата и номер документа
      const docDateMap = new Map<string, { date: Date; docNo: string }>();
      for (const entry of menuJournal) {
        if (entry.IDDOC && entry.DATE) {
          docDateMap.set(entry.IDDOC.trim().toUpperCase(), {
            date: entry.DATE,
            docNo: entry.DOCNO || '',
          });
        }
      }
      console.log(`   ✅ IDDOC документов: ${docDateMap.size}`);

      // Шаг 5: Читаем позиции ПланМеню
      console.log('📖 Шаг 4: Чтение позиций ПланМеню...');
      const menuItems = await menuOneCRepository.getMenuItems();
      console.log(`   ✅ Загружено позиций: ${menuItems.length}`);

      // Шаг 6: Объединяем данные
      console.log('🔗 Шаг 5: Объединение данных...');
      const menuItemsResult: TOneCMenuItemResult[] = [];

      for (const item of menuItems) {
        const dishId = item.SP4301?.trim() || '';
        if (!dishId) continue;

        const dish = dishesMap.get(dishId);
        if (!dish) {
          stats.notFoundDishes++;
          continue;
        }

        const docId = item.IDDOC.trim().toUpperCase();
        const docInfo = docDateMap.get(docId);
        if (!docInfo) continue;

        let itemDateStr = '';
        if (item.SP4300) {
          try {
            const dateObj = new Date(item.SP4300);
            if (!isNaN(dateObj.getTime())) {
              itemDateStr = MenuDateUtils.from1CDate(
                dateObj.toLocaleDateString('ru-RU')
              );
            }
          } catch {
            continue;
          }
        }

        if (!itemDateStr) continue;

        stats.matchedDishes++;

        menuItemsResult.push({
          id: dishId,
          name: dish.DESCR?.trim() || 'Без названия',
          code: dish.CODE?.trim() || '',
          price: this.parsePrice(item.SP4303),
          output: String(item.SP4302 || '').trim(),
          unit: String(dish.SP3177 || '').trim() || 'шт',
          docDate: docInfo.date.toLocaleDateString('ru-RU'),
          docNumber: docInfo.docNo,
          itemDate: itemDateStr,
        });
      }

      stats.totalItems = menuItemsResult.length;
      console.log(`   ✅ Сопоставлено блюд: ${stats.matchedDishes}`);
      console.log(`   ❌ Не найдено блюд: ${stats.notFoundDishes}`);
      console.log(`   📊 Итого позиций: ${stats.totalItems}`);

      if (stats.totalItems === 0) {
        return {
          success: false,
          message: 'Нет данных для сохранения',
          stats,
          errors: ['Не найдено ни одной позиции меню для сохранения'],
        };
      }

      // Шаг 7: Группировка по датам
      console.log('📊 Шаг 6: Группировка по датам...');
      const groupedByDate = this.groupByDate(menuItemsResult);
      stats.totalDays = groupedByDate.size;
      console.log(`   ✅ Сгруппировано по ${groupedByDate.size} датам`);

      // Шаг 8: Сохранение в MongoDB
      console.log('💾 Шаг 7: Сохранение в MongoDB...');
      let savedDays = 0;

      for (const [date, items] of groupedByDate) {
        try {
          const sortedItems = items.sort((a, b) => a.name.localeCompare(b.name));
          const dayOfWeek = MenuDateUtils.getDayOfWeek(date);

          // Формируем блюда с категориями
          const dishesForSave: IDish[] = sortedItems.map((item, index) => {
            const categoryInfo = getDishCategory(item.name);
            
            return {
              number: index + 1,
              name: item.name,
              weight: item.output,
              price: item.price,
              originalPrice: undefined,
              id1C: item.id,
              code1C: item.code,
              unit1C: item.unit,
              docDate: item.docDate,
              docNumber: item.docNumber,
              source: '1c' as const,
              category: categoryInfo.category,
              isChefRecommend: false,
            };
          });

          // Выставляем "Выбор шефа"
          this.setChefRecommendations(dishesForSave);

          // Сохраняем в MongoDB
          await MenuModel.findOneAndUpdate(
            { date },
            {
              date,
              dayOfWeek,
              dishes: dishesForSave,
            },
            { upsert: true, new: true }
          );

          savedDays++;
          console.log(`   ✅ Сохранено: ${date} (${dishesForSave.length} блюд)`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          errors.push(`Ошибка сохранения ${date}: ${errorMessage}`);
          console.error(`   ❌ Ошибка сохранения ${date}:`, errorMessage);
        }
      }

      stats.savedDays = savedDays;

      console.log('='.repeat(60));
      console.log(`✅ Парсинг завершен! Сохранено ${savedDays} дней меню`);

      return {
        success: true,
        message: `Сохранено ${savedDays} дней меню (${stats.totalItems} блюд)`,
        stats,
        errors: errors.length > 0 ? errors : undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      console.error('❌ Ошибка при парсинге 1С:', errorMessage);
      return {
        success: false,
        message: 'Ошибка при парсинге 1С',
        stats,
        errors: [errorMessage],
      };
    }
  }

  /**
   * Рандомно выбирает по 1 блюду из категорий:
   * - soups (супы)
   * - salads (салаты)
   * - sides (гарниры)
   * - meat + poultry (мясо и птица вместе)
   */
  private setChefRecommendations(dishes: IDish[]): void {
    // Группируем блюда по категориям
    const groupedByCategory = new Map<string, IDish[]>();
    
    for (const dish of dishes) {
      const category = dish.category || 'other';
      if (!groupedByCategory.has(category)) {
        groupedByCategory.set(category, []);
      }
      groupedByCategory.get(category)!.push(dish);
    }

    // Категории для "Выбора шефа"
    // meat и poultry объединяем в одну группу
    const targetCategories = ['soups', 'salads', 'sides'];

    // Отдельно обрабатываем meat + poultry как одну группу
    const meatAndPoultry: IDish[] = [
      ...(groupedByCategory.get('meat') || []),
      ...(groupedByCategory.get('poultry') || []),
    ];

    // Выбираем по 1 блюду из каждой категории
    for (const category of targetCategories) {
      const items = groupedByCategory.get(category);
      if (items && items.length > 0) {
        const randomIndex = Math.floor(Math.random() * items.length);
        items[randomIndex].isChefRecommend = true;
        console.log(`   ⭐ "Выбор шефа" в категории ${category}: ${items[randomIndex].name}`);
      }
    }

    // Выбираем 1 блюдо из meat + poultry
    if (meatAndPoultry.length > 0) {
      const randomIndex = Math.floor(Math.random() * meatAndPoultry.length);
      meatAndPoultry[randomIndex].isChefRecommend = true;
      console.log(`   ⭐ "Выбор шефа" в категории meat/poultry: ${meatAndPoultry[randomIndex].name}`);
    }
  }

  private groupByDate(
    items: TOneCMenuItemResult[]
  ): Map<string, TOneCMenuItemResult[]> {
    const grouped = new Map<string, TOneCMenuItemResult[]>();

    for (const item of items) {
      if (!item.itemDate) continue;
      const dateKey = MenuDateUtils.from1CDate(item.itemDate);
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(item);
    }

    return grouped;
  }

  private parsePrice(priceStr: string | number | null): number {
    if (priceStr === null || priceStr === undefined) return 0;
    const str = String(priceStr).trim().replace(/\s/g, '').replace(',', '.');
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  }
}

export const menuParserOneCService = new MenuParserOneCService();