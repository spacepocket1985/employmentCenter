import { connectDB } from '../config/db.config';
import { syncMenu } from '../jobs/syncMenu.job';
import { MenuModel } from '../models/menu.model';

/**
 * Полный цикл синхронизации:
 * 1. Очистка БД
 * 2. Копирование файлов 1С
 * 3. Парсинг и сохранение
 * 4. Очистка кэша
 * 
 * Запуск: npm run fullSync
 */
async function fullSync(): Promise<void> {
  console.log('🔄 ЗАПУСК ПОЛНОГО ЦИКЛА СИНХРОНИЗАЦИИ');
  console.log('='.repeat(60));

  try {
    // Подключаемся к MongoDB
    await connectDB();

    // ============================================================
    // Шаг 1: Очистка БД
    // ============================================================
    console.log('\n🗑️ Шаг 1: Очистка базы данных...');
    
    const deleteResult = await MenuModel.deleteMany({});
    console.log(`   ✅ Удалено записей: ${deleteResult.deletedCount || 0}`);

    // ============================================================
    // Шаг 2: Полная синхронизация
    // ============================================================
    console.log('\n📊 Шаг 2: Запуск синхронизации...');
    
    const result = await syncMenu();

    // ============================================================
    // Шаг 3: Вывод результата
    // ============================================================
    console.log('\n' + '='.repeat(60));
    console.log('📊 РЕЗУЛЬТАТ ПОЛНОГО ЦИКЛА:');
    console.log(`   ✅ Успех: ${result.success}`);
    console.log(`   📝 Сообщение: ${result.message}`);

    if (result.stats) {
      console.log('\n   📊 Статистика:');
      if (result.stats.copiedFiles) {
        console.log(`      - Скопировано файлов: ${result.stats.copiedFiles.length}`);
        console.log(`      - Файлы: ${result.stats.copiedFiles.join(', ')}`);
      }
      if (result.stats.totalDays !== undefined) {
        console.log(`      - Сохранено дней: ${result.stats.totalDays}`);
      }
      if (result.stats.totalDishes !== undefined) {
        console.log(`      - Сохранено блюд: ${result.stats.totalDishes}`);
      }
      if (result.stats.errors && result.stats.errors.length > 0) {
        console.log('\n   ❌ Ошибки:');
        for (const error of result.stats.errors) {
          console.log(`      - ${error}`);
        }
      }
    }

    // ============================================================
    // Шаг 4: Проверка данных в БД
    // ============================================================
    console.log('\n📊 Шаг 4: Проверка данных в БД...');
    const count = await MenuModel.countDocuments();
    console.log(`   ✅ Всего записей в БД: ${count}`);

    if (count > 0) {
      const first = await MenuModel.findOne().sort({ date: 1 });
      const last = await MenuModel.findOne().sort({ date: -1 });
      console.log(`   📅 Первая дата: ${first?.date}`);
      console.log(`   📅 Последняя дата: ${last?.date}`);
    }

    if (result.success && count > 0) {
      console.log('\n✅ ПОЛНЫЙ ЦИКЛ ЗАВЕРШЕН УСПЕШНО!');
    } else {
      console.log('\n❌ ПОЛНЫЙ ЦИКЛ ЗАВЕРШЕН С ОШИБКАМИ!');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Необработанная ошибка:', error);
    process.exit(1);
  }
}

fullSync();