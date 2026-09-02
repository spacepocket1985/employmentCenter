import { TDishCategory } from '../types/menu.types';

export type TDishCategoryInfo = {
  category: TDishCategory;
  order: number;
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
      'запеканка из творога',
      'затирка',
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
      'морс',
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

  // 5. Салаты
  {
    keywords: ['салат', 'винегрет', 'ассорти овощн', 'морковь пряная'],
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
    ],
    category: 'poultry',
    order: 8,
  },

  // 9. Выпечка
  {
    keywords: [
      'булочка',
      'хлеб',
      'пирожок',
      'плетенка',
      'сочни',
      'рожок',
      'батончик',
      'слойка',
      'коврижка',
      'коржик',
      'кекс',
      'печенье',
      'круассан',
      'полоса песочная',
      'языки слоеные',
      'сандвичи песочные',
      'плюшка',
    ],
    category: 'baking',
    order: 9,
  },

  // 10. Десерты
  {
    keywords: [
      'десерт',
      'сладость',
      'рулет',
      'пирожное',
      'торт',
      'мусс',
      'пудинг',
      'вареники ленивые',
      'яблоки печеные',
      'завитушки слоеные',
      'пай',
      'творожник',
      'кекс',
    ],
    category: 'desserts',
    order: 10,
  },
];

export function getDishCategory(name: string): TDishCategoryInfo {
  const lowerName = name.toLowerCase();

  for (const item of CATEGORY_MAP) {
    for (const keyword of item.keywords) {
      if (lowerName.includes(keyword)) {
        return { category: item.category, order: item.order };
      }
    }
  }

  return { category: 'other', order: 999 };
}

export function sortDishesByCategory<T extends { name: string }>(
  dishes: T[]
): T[] {
  return [...dishes].sort((a, b) => {
    const catA = getDishCategory(a.name);
    const catB = getDishCategory(b.name);

    if (catA.order !== catB.order) {
      return catA.order - catB.order;
    }

    return a.name.localeCompare(b.name);
  });
}
