import { Schema, model } from 'mongoose';
import { IMenuDocument, IMenuModel } from '../types/menu.types';

const dishSchema = new Schema(
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
  },
  { _id: false }
);

const menuSchema = new Schema(
  {
    date: {
      type: String,
      required: [true, 'Дата обязательна'],
      trim: true,
      match: [/^\d{2}\.\d{2}\.\d{2}$/, 'Неверный формат даты'],
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
          'Саббота',
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

// Индекс для быстрого поиска по дате
menuSchema.index({ date: 1 }, { unique: true });

// Статический метод для удаления всех меню
menuSchema.statics.clearAll = async function (): Promise<{
  deletedCount: number;
}> {
  const result = await this.deleteMany({});
  return { deletedCount: result.deletedCount || 0 };
};

// Статический метод для получения всего меню с правильной сортировкой по дате
menuSchema.statics.getFullMenu = async function(): Promise<IMenuDocument[]> {
  const menu = await this.find({});
  
  // Явно указываем типы для параметров сортировки
  return menu.sort((a: IMenuDocument, b: IMenuDocument) => {
    // Разбираем даты из формата DD.MM.YY
    const [dayA, monthA, yearA] = a.date.split('.');
    const [dayB, monthB, yearB] = b.date.split('.');
    
    // Создаем строку в формате YYMMDD для корректного сравнения
    const dateA = `${yearA}${monthA}${dayA}`;
    const dateB = `${yearB}${monthB}${dayB}`;
    
    // Сравниваем как строки (теперь это работает правильно)
    return dateA.localeCompare(dateB);
  });
};

// Создаем модель
export const MenuModel = model<IMenuDocument, IMenuModel>('Menu', menuSchema);
