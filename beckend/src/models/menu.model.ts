import { Schema, model } from 'mongoose';
import { IMenuDocument, IMenuModel, IDish } from '../types/menu.types';

/**
 * Схема для блюда
 */
const dishSchema = new Schema<IDish>(
  {
    number: {
      type: Number,
      required: [true, 'Номер блюда обязателен'],
      min: [1, 'Номер должен быть положительным'],
    },
    name: {
      type: String,
      required: [true, 'Название блюда обязательно'],
      trim: true,
      minlength: [2, 'Название слишком короткое'],
    },
    weight: {
      type: String,
      required: [true, 'Вес блюда обязателен'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Цена блюда обязательна'],
      min: [0, 'Цена не может быть отрицательной'],
    },
    originalPrice: {
      type: String,
      trim: true,
    },

    // Поля из 1С
    id1C: {
      type: String,
      trim: true,
      index: true,
    },
    code1C: {
      type: String,
      trim: true,
    },
    unit1C: {
      type: String,
      trim: true,
    },
    docDate: {
      type: String,
      trim: true,
    },
    docNumber: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ['csv', '1c'],
      default: 'csv',
    },

    // ========== НОВЫЕ ПОЛЯ ==========
    category: {
      type: String,
      enum: [
        'dairy',
        'drinks',
        'soups',
        'sides',
        'salads',
        'meat',
        'fish',
        'poultry',
        'baking',
        'desserts',
        'other',
      ],
      trim: true,
      description: 'Категория блюда',
    },
    isChefRecommend: {
      type: Boolean,
      default: false,
      description: 'Выбор шефа (рандомно)',
    },
  },
  { _id: false }
);

/**
 * Схема для меню на день
 */
const menuSchema = new Schema<IMenuDocument>(
  {
    date: {
      type: String,
      required: [true, 'Дата обязательна'],
      trim: true,
      match: [
        /^\d{2}\.\d{2}\.\d{2}$/,
        'Неверный формат даты (ожидается ДД.ММ.ГГ)',
      ],
      unique: true,
      index: true,
    },
    dayOfWeek: {
      type: String,
      required: [true, 'День недели обязателен'],
      trim: true,
      enum: {
        values: [
          'Понедельник',
          'Вторник',
          'Среда',
          'Четверг',
          'Пятница',
          'Суббота',
          'Воскресенье',
        ],
        message: 'Некорректный день недели',
      },
    },
    dishes: {
      type: [dishSchema],
      required: [true, 'Список блюд обязателен'],
      validate: {
        validator: function (dishes: unknown[]) {
          return dishes && dishes.length > 0;
        },
        message: 'Меню должно содержать хотя бы одно блюдо',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// === Индексы ===

// Уникальный индекс по дате
menuSchema.index({ date: 1 }, { unique: true });

// ========== НОВЫЕ ИНДЕКСЫ ==========
// Индекс для поиска по категории
menuSchema.index({ 'dishes.category': 1 });

// Индекс для поиска по флагу "Выбор шефа"
menuSchema.index({ 'dishes.isChefRecommend': 1 });

// Композитный индекс для быстрого поиска рекомендаций
menuSchema.index({ date: 1, 'dishes.isChefRecommend': 1 });

// Существующие индексы
menuSchema.index({ 'dishes.source': 1 });
menuSchema.index({ 'dishes.id1C': 1 });
menuSchema.index({ 'dishes.docNumber': 1 });
menuSchema.index({ 'dishes.source': 1, 'dishes.id1C': 1 });

/**
 * Очищает все меню
 */
menuSchema.statics.clearAll = async function (): Promise<{
  deletedCount: number;
}> {
  const result = await this.deleteMany({});
  return { deletedCount: result.deletedCount || 0 };
};

/**
 * Получает все меню с правильной сортировкой по дате
 */
menuSchema.statics.getFullMenu = async function (): Promise<IMenuDocument[]> {
  const menu = await this.find({});

  return menu.sort((a: IMenuDocument, b: IMenuDocument) => {
    const [dayA, monthA, yearA] = a.date.split('.');
    const [dayB, monthB, yearB] = b.date.split('.');
    const dateA = `${yearA}${monthA}${dayA}`;
    const dateB = `${yearB}${monthB}${dayB}`;
    return dateA.localeCompare(dateB);
  });
};

/**
 * Получить меню по дате
 */
menuSchema.statics.getByDate = async function (
  date: string
): Promise<IMenuDocument | null> {
  const normalizedDate = date.length === 10 ? date.slice(0, 8) : date;

  return this.findOne({ date: normalizedDate });
};

/**
 * Получить меню за период
 */
menuSchema.statics.getByPeriod = async function (
  dateFrom: string,
  dateTo: string
): Promise<IMenuDocument[]> {
  const normalizedFrom =
    dateFrom.length === 10 ? dateFrom.slice(0, 8) : dateFrom;
  const normalizedTo = dateTo.length === 10 ? dateTo.slice(0, 8) : dateTo;

  return this.find({
    date: { $gte: normalizedFrom, $lte: normalizedTo },
  }).sort({ date: 1 });
};

// Создаем модель
export const MenuModel = model<IMenuDocument, IMenuModel>('Menu', menuSchema);
