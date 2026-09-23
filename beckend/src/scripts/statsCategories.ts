// src/scripts/statsCategories.ts

import { connectDB } from '../config/db.config';
import { MenuModel } from '../models/menu.model';
import { TDishCategory } from '../types/menu.types';

interface CategoryStats {
  readonly category: TDishCategory;
  readonly count: number;
  readonly byParentId: Map<string, number>;
  readonly examples: string[];
}

const PARENT_NAMES: Record<string, string> = {
  '1HQ': 'Холодные',
  '1HS': 'Горячие',
  '1HR': 'Супы',
  '1MO': 'Мучные',
  '1R2': 'Напитки',
  '1HU': 'Сладкие',
  '1RE': 'Соки',
  '1H3': 'Полуфабрикаты',
  '2J9': 'Приправы',
  '0': '(пусто)',
};

async function statsCategories(): Promise<void> {
  console.log('📊 Статистика категорий...');
  console.log('='.repeat(70));

  await connectDB();

  const allMenus = await MenuModel.find({});
  const stats = new Map<TDishCategory, CategoryStats>();

  for (const menu of allMenus) {
    for (const dish of menu.dishes) {
      const category = (dish.category || 'other') as TDishCategory;
      const parentId = dish.parentId || '(нет)';

      if (!stats.has(category)) {
        stats.set(category, {
          category,
          count: 0,
          byParentId: new Map(),
          examples: [],
        });
      }

      const s = stats.get(category)!;
      (s as { count: number }).count++;

      const parentCount = s.byParentId.get(parentId) || 0;
      s.byParentId.set(parentId, parentCount + 1);

      if (s.examples.length < 5) {
        (s as { examples: string[] }).examples.push(dish.name);
      }
    }
  }

  const sorted = Array.from(stats.values()).sort(
    (a, b) => b.count - a.count
  );

  for (const s of sorted) {
    console.log(`\n📁 ${s.category}  —  ${s.count} блюд`);
    console.log('   Источники (parentId):');
    const parents = Array.from(s.byParentId.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    for (const [parentId, count] of parents) {
      const name = PARENT_NAMES[parentId] || parentId;
      console.log(`     ${String(count).padStart(5)} × ${name} (${parentId})`);
    }
    console.log('   Примеры:');
    for (const ex of s.examples.slice(0, 3)) {
      console.log(`     • ${ex}`);
    }
  }

  console.log('\n' + '='.repeat(70));
  console.log('📊 ИТОГО:');

  const total = sorted.reduce((sum, s) => sum + s.count, 0);

  for (const s of sorted) {
    const percent = ((s.count / total) * 100).toFixed(1);
    console.log(
      `   ${s.category.padEnd(10)} ${String(s.count).padStart(6)} (${percent}%)`
    );
  }

  console.log(`\n   Всего блюд: ${total}`);
  console.log(`   Всего дней: ${allMenus.length}`);

  process.exit(0);
}

statsCategories().catch((error) => {
  console.error('❌ Ошибка:', error);
  process.exit(1);
});