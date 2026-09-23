// src/scripts/testCategory.ts

import { connectDB } from '../config/db.config';
import { MenuModel } from '../models/menu.model';

interface TestCase {
  readonly name: string;
  readonly expectedCategory: string;
}

/**
 * Тестовые кейсы — блюда, которые раньше попадали не в свои категории
 */
const TEST_CASES: TestCase[] = [
  // === ПРОБЛЕМНЫЕ КЕЙСЫ ИЗ АНАЛИЗА ===
  {
    name: 'салат из морской и белокоч.капусты',
    expectedCategory: 'salads',
  },
  {
    name: 'какао с молоком',
    expectedCategory: 'drinks',
  },
  {
    name: 'чай с молоком',
    expectedCategory: 'drinks',
  },
  {
    name: 'суп молочный',
    expectedCategory: 'soups',
  },
  {
    name: 'пирожки печ.сдобн. с творогом',
    expectedCategory: 'culinary',
  },
  {
    name: 'блинчики с творожн.фаршем',
    expectedCategory: 'culinary',
  },
  {
    name: 'Треугольник с начинкой',
    expectedCategory: 'culinary',
  },
  {
    name: 'ножки куриные',
    expectedCategory: 'poultry',
  },
  {
    name: 'картофель гарнирный запеченый',
    expectedCategory: 'sides',
  },
  {
    name: 'крендель сахарный',
    expectedCategory: 'culinary',
  },
  {
    name: 'сладкие творожные квадратики',
    expectedCategory: 'culinary',
  },
  {
    name: 'Рулетик Наслаждение',
    expectedCategory: 'culinary',
  },

  // === БАЗОВЫЕ ПРОВЕРКИ ===
  {
    name: 'печенье Штучное',
    expectedCategory: 'culinary',
  },
  {
    name: 'печень отбивная',
    expectedCategory: 'meat',
  },
  {
    name: 'холодник',
    expectedCategory: 'soups',
  },
  {
    name: 'творог со сметаной',
    expectedCategory: 'dairy',
  },
  {
    name: 'компот из яблок',
    expectedCategory: 'drinks',
  },
  {
    name: 'каша гречневая',
    expectedCategory: 'sides',
  },
  {
    name: 'говядина тушеная',
    expectedCategory: 'meat',
  },
  {
    name: 'рыба жареная хек',
    expectedCategory: 'fish',
  },
  {
    name: 'булочка Снежинка',
    expectedCategory: 'culinary',
  },
];

interface DishRow {
  readonly name: string;
  readonly category: string;
  readonly parentId: string;
  readonly sp4618: string;
}

interface TestResult {
  readonly testName: string;
  readonly found: boolean;
  readonly foundName: string;
  readonly actualCategory: string;
  readonly expectedCategory: string;
  readonly parentId: string;
  readonly sp4618: string;
  readonly ok: boolean;
}

async function testCategory(): Promise<void> {
  console.log('🧪 Тест категоризации блюд...');
  console.log('='.repeat(70));

  await connectDB();

  const allMenus = await MenuModel.find({});

  // Собираем все блюда из БД
  const allDishes: DishRow[] = [];

  for (const menu of allMenus) {
    for (const dish of menu.dishes) {
      allDishes.push({
        name: dish.name,
        category: dish.category || 'other',
        parentId: dish.parentId || '',
        sp4618: dish.sp4618 || '',
      });
    }
  }

  console.log(`📊 Всего блюд в БД: ${allDishes.length}\n`);

  const results: TestResult[] = [];

  for (const testCase of TEST_CASES) {
    const searchLower = testCase.name.toLowerCase();

    const found = allDishes.find((d) =>
      d.name.toLowerCase().includes(searchLower)
    );

    if (!found) {
      results.push({
        testName: testCase.name,
        found: false,
        foundName: '',
        actualCategory: '',
        expectedCategory: testCase.expectedCategory,
        parentId: '',
        sp4618: '',
        ok: false,
      });
      continue;
    }

    const ok = found.category === testCase.expectedCategory;

    results.push({
      testName: testCase.name,
      found: true,
      foundName: found.name,
      actualCategory: found.category,
      expectedCategory: testCase.expectedCategory,
      parentId: found.parentId,
      sp4618: found.sp4618,
      ok,
    });
  }

  // Выводим результаты
  for (const r of results) {
    if (!r.found) {
      console.log(`❓ "${r.testName}"`);
      console.log(`   ⚠️ Не найдено в БД`);
      console.log('');
      continue;
    }

    if (r.ok) {
      console.log(`✅ "${r.foundName}"`);
    } else {
      console.log(`❌ "${r.foundName}"`);
    }
    console.log(
      `   📁 parentId: ${r.parentId || '(нет)'}, sp4618: ${r.sp4618 || '(нет)'}`
    );
    console.log(`   🏷️ Ожидали: ${r.expectedCategory}, получили: ${r.actualCategory}`);
    console.log('');
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.length - passed;

  console.log('='.repeat(70));
  console.log('📊 ИТОГ ТЕСТА:');
  console.log(`   ✅ Пройдено: ${passed}`);
  console.log(`   ❌ Провалено: ${failed}`);
  console.log(`   📋 Всего тестов: ${results.length}`);
  console.log(
    `   📈 Успех: ${((passed / results.length) * 100).toFixed(1)}%`
  );

  process.exit(failed > 0 ? 1 : 0);
}

testCategory().catch((error) => {
  console.error('❌ Ошибка:', error);
  process.exit(1);
});