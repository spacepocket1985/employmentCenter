// src/utils/dishCategory.ts

import { TDishCategory } from '../types/menu.types';

export type TDishCategoryInfo = {
  category: TDishCategory;
  order: number;
};

/**
 * Порядок категорий для сортировки
 * ВАЖНО: poultry и fish идут ПЕРЕД meat, чтобы блюда из птицы/рыбы
 * не попадали в мясо по ключевым словам "котлета", "биточки" и т.д.
 */
export const CATEGORY_ORDER: Record<TDishCategory, number> = {
  dairy: 1,
  soups: 2,
  drinks: 3,
  sides: 4,
  salads: 5,
  poultry: 6,
  fish: 7,
  meat: 8,
  culinary: 9,
  other: 10,
};

// ============================================================
//  МАППИНГ PARENTID → КАТЕГОРИЯ
// ============================================================
export const PARENT_ID_TO_CATEGORY: Record<string, TDishCategory> = {
  '1HR': 'soups',
  '1RE': 'drinks',
  '1R2': 'drinks',
  '1MO': 'culinary',
  '1H3': 'other',
  '2J9': 'other',
  '0': 'other',
};

// ============================================================
//  МАППИНГ (PARENTID + SP4618) → КАТЕГОРИЯ
// ============================================================
export const PARENT_SP_TO_CATEGORY: Record<string, TDishCategory> = {
  '1HQ|4': 'salads',
  '1HQ|2': 'dairy',
  '1HQ|1': 'dairy',
  '1HS|6': 'sides',
  '1HU|3': 'drinks',
  '1HU|4': 'drinks',
};

// ============================================================
//  КЛЮЧЕВЫЕ СЛОВА
// ============================================================
export const CATEGORY_MAP: {
  keywords: string[];
  category: TDishCategory;
  order: number;
}[] = [
  // 1. Творог, молочные
  // ДОБАВИЛИ: 'блины' (блины со сметаной → dairy)
  {
    keywords: [
      'творог',
      'сырник',
      'творожник',
      'запеканка',
      'затирка',
      'вареники',
      'лимон с сахаром',
      'сметана',
      'блины', // ← ДОБАВИЛИ
    ],
    category: 'dairy',
    order: 1,
  },

  // 2. Супы
  {
    keywords: [
      'суп',
      'борщ',
      'рассольник',
      'окрошка',
      'уха',
      'щи',
      'солянка',
      'холодник',
      'похлебка',
      'бульон',
    ],
    category: 'soups',
    order: 2,
  },

  // 3. Напитки
  {
    keywords: [
      'компот',
      'кофе',
      'чай',
      'какао',
      'напиток',
      'кисель',
      'сок',
      'нектар',
      'квас',
      'желе',
      'морс ',
      'морс,',
      'кефир',
      'с молоком',
      'на молоке',
    ],
    category: 'drinks',
    order: 3,
  },

  // 4. Гарниры
  {
    keywords: [
      'каша',
      'пюре картофельное',
      'картофель отварной',
      'картофель гарнирный',
      'гарнирный',
      'макароны',
      'рис отварной',
      'гречка',
      'перловка',
      'овсянка',
      'ячневая',
      'пшенная',
      'кукурузная',
      'рагу из овощей',
      'смесь из овощей',
      'овощи отварные',
      'капуста тушеная',
      'капуста цветная',
      'свекла тушеная',
      'брокколи',
      'бабка картофельная',
    ],
    category: 'sides',
    order: 4,
  },

  // 5. Салаты
  {
    keywords: [
      'салат',
      'винегрет',
      'ассорти овощн',
      'морковь пряная',
      'морской',
      'морская',
      'сельдь матиас',
    ],
    category: 'salads',
    order: 5,
  },

  // 6. Птица (ПЕРЕД мясом)
  {
    keywords: [
      'птица',
      'курица',
      'цыпленок',
      'куриный',
      'филе птицы',
      'окорочек',
      'бедро',
      'грудка куриная',
      'цыплята',
      'ножки',
      'чахохбили',
    ],
    category: 'poultry',
    order: 6,
  },

  // 7. Рыба (ПЕРЕД мясом)
  {
    keywords: [
      'рыба',
      'хек',
      'скумбрия',
      'горбуша',
      'минтай',
      'сельдь',
      'судак',
      'треска',
      'окунь',
      'филе рыбное',
      'филе рыбы',
      'сом',
      'щука',
      'нептун',
    ],
    category: 'fish',
    order: 7,
  },

  // 8. Мясо (ПОСЛЕ птицы и рыбы)
  // ДОБАВИЛИ: 'язык'
  {
    keywords: [
      'свинина',
      'говядина',
      'котлета',
      'гуляш',
      'шницель',
      'бифштекс',
      'поджарка',
      'отбивная',
      'тефтели',
      'биточки',
      'мясо',
      'бефстроганов',
      'фрикадельки',
      'мачанка',
      'зразы',
      'колбаса',
      'жаркое',
      'печень',
      'сердце',
      'плов',
      'кнели',
      'колбаски',
      'шашлык',
      'голубцы',
      'оладьи из печени',
      'оладьи печеночные',
      'бабка картофельная с грудинкой',
      'язык', // ← ДОБАВИЛИ
    ],
    category: 'meat',
    order: 8,
  },

  // 9. Кулинария
  {
    keywords: [
      'булочка',
      'хлеб',
      'пирожок',
      'плетенка',
      'рожок',
      'батончик',
      'слойка',
      'коржик',
      'полоса песочная',
      'сочни',
      'коврижка',
      'круассан',
      'плюшка',
      'языки слоеные',
      'сандвичи песочные',
      'завитушки слоеные',
      'пирожки',
      'заварное',
      'кольцо',
      'винтики',
      'полоска',
      'палочки',
      'юмбрик',
      'пончики',
      'пышки',
      'хворост',
      'чебурек',
      'беляши',
      'блинчик',
      'треугольник',
      'крендель',
      'рулетик',
      'десерт',
      'сладость',
      'рулет',
      'пирожное',
      'торт',
      'мусс',
      'пудинг',
      'вареники ленивые',
      'яблоки печеные',
      'пай',
      'кекс',
      'квадратики',
      'печенье',
      'пряник',
      'вафли',
      'конфеты',
      'мармелад',
      'зефир',
      'пастила',
      'шоколад',
    ],
    category: 'culinary',
    order: 9,
  },

  // 10. Другое
  {
    keywords: [],
    category: 'other',
    order: 10,
  },
];

// ============================================================
//  ПРИОРИТЕТНЫЕ ПРОВЕРКИ
// ============================================================

function getPriorityCategory(lowerName: string): TDishCategoryInfo | null {
  // 1. ПТИЦА
  if (
    lowerName.includes('курин') ||
    lowerName.includes('цыплят') ||
    lowerName.includes('птиц') ||
    lowerName.includes('чахохбили')
  ) {
    return { category: 'poultry', order: CATEGORY_ORDER.poultry };
  }

  // 2. РЫБА
  if (
    lowerName.includes('рыб') ||
    lowerName.includes('нептун') ||
    lowerName.includes('хек') ||
    lowerName.includes('скумбр') ||
    lowerName.includes('горбуш') ||
    lowerName.includes('минтай') ||
    lowerName.includes('сельдь матиас')
  ) {
    return { category: 'fish', order: CATEGORY_ORDER.fish };
  }

  // 3. ГАРНИРЫ
  if (lowerName.includes('гарнирн')) {
    return { category: 'sides', order: CATEGORY_ORDER.sides };
  }

  return null;
}

// ============================================================
//  ОСНОВНАЯ ФУНКЦИЯ
// ============================================================

export function getDishCategory(
  name: string,
  parentId?: string,
  sp4618?: string
): TDishCategoryInfo {
  // УРОВЕНЬ 1: PARENTID
  if (parentId) {
    const normalizedParentId = parentId.trim();
    const byParent = PARENT_ID_TO_CATEGORY[normalizedParentId];

    if (byParent) {
      return {
        category: byParent,
        order: CATEGORY_ORDER[byParent],
      };
    }

    // УРОВЕНЬ 2: PARENTID + SP4618
    if (sp4618) {
      const normalizedSp = sp4618.trim();
      const key = `${normalizedParentId}|${normalizedSp}`;
      const byCombo = PARENT_SP_TO_CATEGORY[key];

      if (byCombo) {
        return {
          category: byCombo,
          order: CATEGORY_ORDER[byCombo],
        };
      }
    }
  }

  // УРОВЕНЬ 3: Ключевые слова
  return getCategoryByKeywords(name);
}

function getCategoryByKeywords(name: string): TDishCategoryInfo {
  const lowerName = name.toLowerCase();

  // ПРИОРИТЕТНЫЕ ПРОВЕРКИ
  const priority = getPriorityCategory(lowerName);
  if (priority) {
    return priority;
  }

  // ОСНОВНОЙ ЦИКЛ
  for (const item of CATEGORY_MAP) {
    for (const keyword of item.keywords) {
      // 1. 'печень' не срабатывает для 'печенье'
      if (keyword === 'печень' && lowerName.includes('печенье')) {
        continue;
      }

      // 2. 'морс' не срабатывает для 'морской'/'морская'
      if (
        keyword === 'морс' &&
        (lowerName.includes('морской') || lowerName.includes('морская'))
      ) {
        continue;
      }

      // 3. 'творог' не срабатывает для выпечки с творогом
      if (
        keyword === 'творог' &&
        (lowerName.includes('пирож') ||
          lowerName.includes('блинчик') ||
          lowerName.includes('треугольник') ||
          lowerName.includes('квадратик') ||
          lowerName.includes('рулетик'))
      ) {
        continue;
      }

      // 4. 'вареники' не срабатывает для 'вареники ленивые'
      if (keyword === 'вареники' && lowerName.includes('вареники ленивые')) {
        continue;
      }

      // 5. 'бабка картофельная' не срабатывает, если есть 'грудинк'
      if (keyword === 'бабка картофельная' && lowerName.includes('грудинк')) {
        continue;
      }

      // 6. 'блины' не срабатывает для 'блинчик'
      if (keyword === 'блины' && lowerName.includes('блинчик')) {
        continue;
      }

      if (lowerName.includes(keyword)) {
        return { category: item.category, order: item.order };
      }
    }
  }

  return { category: 'other', order: 999 };
}

// ============================================================
//  СОРТИРОВКА
// ============================================================

export function sortDishesByCategory<
  T extends {
    name: string;
    category?: TDishCategory;
    parentId?: string;
    sp4618?: string;
  }
>(dishes: T[]): T[] {
  return [...dishes].sort((a, b) => {
    const catA = a.category
      ? { category: a.category, order: CATEGORY_ORDER[a.category] || 999 }
      : getDishCategory(a.name, a.parentId, a.sp4618);

    const catB = b.category
      ? { category: b.category, order: CATEGORY_ORDER[b.category] || 999 }
      : getDishCategory(b.name, b.parentId, b.sp4618);

    if (catA.order !== catB.order) {
      return catA.order - catB.order;
    }

    return a.name.localeCompare(b.name);
  });
}

// ============================================================
//  ВСПОМОГАТЕЛЬНЫЕ
// ============================================================

export function getCategoryOrder(category: TDishCategory): number {
  return CATEGORY_ORDER[category] || 999;
}

export function isValidCategory(category: string): category is TDishCategory {
  return category in CATEGORY_ORDER;
}

export function getAllCategories(): {
  category: TDishCategory;
  order: number;
}[] {
  return Object.entries(CATEGORY_ORDER).map(([category, order]) => ({
    category: category as TDishCategory,
    order,
  }));
}

export function hasParentIdMapping(parentId: string): boolean {
  return parentId.trim() in PARENT_ID_TO_CATEGORY;
}

export function hasParentSpMapping(parentId: string, sp4618: string): boolean {
  const key = `${parentId.trim()}|${sp4618.trim()}`;
  return key in PARENT_SP_TO_CATEGORY;
}
