import oneCConfig from '../config/oneC.config';
import { menuOneCRepository } from '../repositories/menu.1c.repository';
import {
  TMenuFilter,
  TOneCMenuItemResult,
  TOneCDish,
  TOneCMenuItem,
} from '../types/oneC.types';
import { DateUtils } from '../utils/dateUtils';
import { getDishCategory, sortDishesByCategory } from '../utils/dishCategory';

export class MenuOneCService {
  async getMenuFromOneC(filter?: TMenuFilter): Promise<TOneCMenuItemResult[]> {
    try {
      const dishes = await menuOneCRepository.getAllDishes();

      const dishesMap = new Map<string, TOneCDish>();
      for (const dish of dishes) {
        if (dish.ID) {
          dishesMap.set(dish.ID.trim(), dish);
        }
      }

      console.log(`✅ Загружено блюд из 1С: ${dishesMap.size}`);

      const journal = await menuOneCRepository.getJournal();
      console.log(`✅ Загружено записей из журнала: ${journal.length}`);

      const menuJournal = journal.filter(
        (j) => j.IDJOURNAL === oneCConfig.menuJournalId
      );
      console.log(
        `📊 Найдено документов ПланМеню в журнале: ${menuJournal.length}`
      );

      const docDateMap = new Map<string, { date: Date; docNo: string }>();
      let validDates = 0;
      let maxDate: Date | null = null;

      for (const entry of menuJournal) {
        if (entry.IDDOC && entry.DATE && DateUtils.isValidDate(entry.DATE)) {
          const normalizedId = entry.IDDOC.trim().toUpperCase();
          docDateMap.set(normalizedId, {
            date: entry.DATE,
            docNo: entry.DOCNO || '',
          });
          validDates++;

          if (!maxDate || entry.DATE > maxDate) {
            maxDate = entry.DATE;
          }
        }
      }

      console.log(`📅 IDDOC документов ПланМеню: ${docDateMap.size}`);
      console.log(`📅 Дат в журнале: ${validDates} валидных`);
      if (maxDate) {
        console.log(
          `📅 Последняя дата в журнале: ${DateUtils.formatDate(maxDate)}`
        );
      }

      let menuItems = await menuOneCRepository.getMenuItems();
      console.log(`✅ Загружено позиций ПланМеню: ${menuItems.length}`);

      if (filter && validDates > 0) {
        const hasDocumentsInPeriod = this.hasDocumentsInPeriod(
          docDateMap,
          filter
        );

        if (
          !hasDocumentsInPeriod &&
          (filter.period === 'month' || filter.period === 'week')
        ) {
          console.log(
            `⚠️ Нет документов за ${filter.period}, используем последнюю доступную дату`
          );

          if (maxDate) {
            const adjustedFilter: TMenuFilter = {
              dateFrom: DateUtils.getStartOfMonth(maxDate),
              dateTo: DateUtils.getEndOfMonth(maxDate),
              period: 'custom',
            };
            menuItems = this.filterMenuByDate(
              menuItems,
              docDateMap,
              adjustedFilter
            );
          } else {
            menuItems = this.filterMenuByDate(menuItems, docDateMap, filter);
          }
        } else {
          menuItems = this.filterMenuByDate(menuItems, docDateMap, filter);
        }
        console.log(`📊 После фильтрации по дате: ${menuItems.length} позиций`);
      }

      const result: TOneCMenuItemResult[] = [];
      let matchCount = 0;
      let noMatchCount = 0;

      for (const item of menuItems) {
        const dishId = item.SP4301?.trim() || '';

        if (dishId && dishesMap.has(dishId)) {
          const dish = dishesMap.get(dishId);
          if (dish) {
            let name = dish.DESCR?.trim() || 'Без названия';
            name = this.cleanText(name);

            const docId = item.IDDOC.trim().toUpperCase();
            const docInfo = docDateMap.get(docId);

            // Определяем категорию
            const categoryInfo = getDishCategory(name);

            matchCount++;
            result.push({
              id: dishId,
              name: name,
              code: dish.CODE?.trim() || '',
              price: this.parsePrice(item.SP4303),
              output: String(item.SP4302 || '').trim(),
              unit: String(dish.SP3177 || '').trim() || 'шт',
              docDate: docInfo?.date
                ? DateUtils.formatDate(docInfo.date)
                : undefined,
              docNumber: docInfo?.docNo,
              itemDate: item.SP4300
                ? DateUtils.formatDate(new Date(item.SP4300))
                : undefined,
              category: categoryInfo.category,
              categoryOrder: categoryInfo.order,
            });
          }
        } else {
          noMatchCount++;
          if (noMatchCount <= 10) {
            console.log(`🔍 Не найдено: "${dishId}" из SP4301`);
          }
        }
      }

      const sortedResult = sortDishesByCategory(result);

      console.log(`📊 Статистика сопоставления:`);
      console.log(`  ✅ Совпало: ${matchCount}`);
      console.log(`  ❌ Не совпало: ${noMatchCount}`);
      console.log(
        `🍽️ Итоговое меню: ${sortedResult.length} блюд (отсортировано по категориям)`
      );

      return sortedResult;
    } catch (error) {
      console.error('❌ Ошибка при получении меню из 1С:', error);
      throw new Error('Не удалось загрузить меню из базы 1С');
    }
  }

  private hasDocumentsInPeriod(
    docDateMap: Map<string, { date: Date; docNo: string }>,
    filter: TMenuFilter
  ): boolean {
    const now = new Date();
    let dateFrom: Date;
    let dateTo: Date;

    if (filter.period === 'month') {
      dateFrom = DateUtils.getStartOfMonth(now);
      dateTo = DateUtils.getEndOfMonth(now);
    } else if (filter.period === 'week') {
      dateFrom = DateUtils.getStartOfWeek(now);
      dateTo = DateUtils.getEndOfWeek(now);
    } else {
      return true;
    }

    for (const [, value] of docDateMap) {
      if (DateUtils.isDateInRange(value.date, dateFrom, dateTo)) {
        return true;
      }
    }
    return false;
  }

  private filterMenuByDate(
    menuItems: TOneCMenuItem[],
    docDateMap: Map<string, { date: Date; docNo: string }>,
    filter: TMenuFilter
  ): TOneCMenuItem[] {
    let dateFrom: Date;
    let dateTo: Date;
    const now = new Date();

    if (filter.period === 'month') {
      dateFrom = DateUtils.getStartOfMonth(now);
      dateTo = DateUtils.getEndOfMonth(now);
    } else if (filter.period === 'week') {
      dateFrom = DateUtils.getStartOfWeek(now);
      dateTo = DateUtils.getEndOfWeek(now);
    } else if (filter.dateFrom && filter.dateTo) {
      dateFrom = filter.dateFrom;
      dateTo = filter.dateTo;
    } else {
      return menuItems;
    }

    const filteredItems = menuItems.filter((item) => {
      const docId = item.IDDOC.trim().toUpperCase();
      const docInfo = docDateMap.get(docId);
      if (!docInfo) return false;
      return DateUtils.isDateInRange(docInfo.date, dateFrom, dateTo);
    });

    return filteredItems;
  }

  private parsePrice(priceStr: string | number | null): number {
    if (priceStr === null || priceStr === undefined) return 0;
    const str = String(priceStr).trim().replace(/\s/g, '').replace(',', '.');
    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
  }

  private cleanText(text: string): string {
    let cleaned = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
    const replacements: [string | RegExp, string][] = [
      [/\uFFFD/g, ''],
      [/\u00A0/g, ' '],
      [/\u2014/g, '—'],
      [/\u2013/g, '–'],
      [/\u201C/g, '"'],
      [/\u201D/g, '"'],
      [/\u2018/g, "'"],
      [/\u2019/g, "'"],
      [/\u2022/g, '•'],
      [/\u00AE/g, '®'],
      [/\u2122/g, '™'],
      [/[ - ]/g, ' '],
    ];

    for (const [pattern, replacement] of replacements) {
      cleaned = cleaned.replace(pattern, replacement);
    }

    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
  }
}

export const menuOneCService = new MenuOneCService();
