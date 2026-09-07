import { TDishCategory } from '../types/menu.types';

export type TDishCategoryInfo = {
  category: TDishCategory;
  order: number;
};

export const CATEGORY_ORDER: Record<TDishCategory, number> = {
  dairy: 1,
  drinks: 2,
  soups: 3,
  sides: 4,
  salads: 5,
  meat: 6,
  fish: 7,
  poultry: 8,
  culinary: 9,
  other: 10,
};

export const CATEGORY_MAP: {
  keywords: string[];
  category: TDishCategory;
  order: number;
}[] = [
  // 1. Творог, молочные
  {
    keywords: [
      'творог',
      'сырник',
      'творожник',
      'запеканка',
      'затирка',
      'вареники',
      'лимон с сахаром',
    ],
    category: 'dairy',
    order: 1,
  },

  // 2. Напитки
  {
    keywords: [
      'компот',
      'кофе',
      'чай',
      'какао',
      'напиток',
      'кисель',
      'лимон с сахаром',
      'сок',
      'нектар',
      'квас',
      'желе',
      // 'морс' - убираем, чтобы не конфликтовать с 'морской'
      // Вместо этого используем более точные ключевые слова
      'морс ', // с пробелом в конце
      'морс,', // с запятой
    ],
    category: 'drinks',
    order: 2,
  },

  // 3. Супы
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
    order: 3,
  },

  // 4. Гарниры
  {
    keywords: [
      'каша',
      'пюре картофельное',
      'картофель',
      'макароны',
      'рис',
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
    ],
    category: 'sides',
    order: 4,
  },

  // 5. Салаты - ПЕРЕМЕЩАЕМ ВВЕРХ, чтобы проверять раньше напитков
  {
    keywords: [
      'салат',
      'винегрет',
      'ассорти овощн',
      'морковь пряная',
      'морской',
      'морская',
    ],
    category: 'salads',
    order: 5,
  },

  // 6. Мясо
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
    ],
    category: 'meat',
    order: 6,
  },

  // 7. Рыба
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
    ],
    category: 'fish',
    order: 7,
  },

  // 8. Птица
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
    ],
    category: 'poultry',
    order: 8,
  },

  // ============================================================
  // 9. КУЛИНАРИЯ (объединяет выпечку и десерты)
  // ============================================================
  {
    keywords: [
      // ===== ВЫПЕЧКА =====
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

      // ===== ДЕСЕРТЫ =====
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

      // ===== КОНДИТЕРСКИЕ ИЗДЕЛИЯ =====
      'печенье', // ← ВАЖНО: 'печенье' ДОЛЖНО БЫТЬ ПЕРЕД 'печень'
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

/**
 * Определяет категорию блюда по его названию
 *
 * ВАЖНО:
 * - Сначала проверяем 'печенье' (кондитерка) → culinary
 * - Потом 'печень' (субпродукт) → meat
 * - Это решает конфликт ключевых слов
 */
export function getDishCategory(name: string): TDishCategoryInfo {
  const lowerName = name.toLowerCase();

  for (const item of CATEGORY_MAP) {
    for (const keyword of item.keywords) {
      // ===== СПЕЦИАЛЬНАЯ ОБРАБОТКА КОНФЛИКТА 'печень' =====
      if (keyword === 'печень' && lowerName.includes('печенье')) {
        continue;
      }

      // ===== СПЕЦИАЛЬНАЯ ОБРАБОТКА ДЛЯ 'морс' =====
      // Если ключевое слово 'морс' и в названии есть 'морской' или 'морская'
      // то пропускаем (это обработается в салатах)
      if (
        keyword === 'морс' &&
        (lowerName.includes('морской') || lowerName.includes('морская'))
      ) {
        continue;
      }

      if (lowerName.includes(keyword)) {
        return { category: item.category, order: item.order };
      }
    }
  }

  return { category: 'other', order: 999 };
}

/**
 * Сортирует блюда по категориям
 */
export function sortDishesByCategory<
  T extends { name: string; category?: TDishCategory }
>(dishes: T[]): T[] {
  return [...dishes].sort((a, b) => {
    const catA = a.category
      ? { category: a.category, order: CATEGORY_ORDER[a.category] || 999 }
      : getDishCategory(a.name);

    const catB = b.category
      ? { category: b.category, order: CATEGORY_ORDER[b.category] || 999 }
      : getDishCategory(b.name);

    if (catA.order !== catB.order) {
      return catA.order - catB.order;
    }

    return a.name.localeCompare(b.name);
  });
}

/**
 * Получает порядок категории
 */
export function getCategoryOrder(category: TDishCategory): number {
  return CATEGORY_ORDER[category] || 999;
}

/**
 * Проверяет, является ли категория валидной
 */
export function isValidCategory(category: string): category is TDishCategory {
  return category in CATEGORY_ORDER;
}

/**
 * Получает все доступные категории с их порядком
 */
export function getAllCategories(): {
  category: TDishCategory;
  order: number;
}[] {
  return Object.entries(CATEGORY_ORDER).map(([category, order]) => ({
    category: category as TDishCategory,
    order,
  }));
}
