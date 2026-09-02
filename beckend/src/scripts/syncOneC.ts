import { connectDB } from '../config/db.config';
import { syncMenu } from '../jobs/syncMenu.job';

/**
 * Тестовый запуск синхронизации меню
 *
 * Запуск: npx ts-node src/scripts/testSync.ts
 */
async function testSync() {
  console.log('🧪 Запуск теста синхронизации меню...');
  console.log('='.repeat(60));

  try {
    // Подключаемся к MongoDB
    await connectDB();

    console.log('\n📊 Запускаем синхронизацию...\n');

    // Запускаем синхронизацию
    const result = await syncMenu();

    console.log('\n' + '='.repeat(60));
    console.log('📊 Результат теста:');
    console.log(`   ✅ Успех: ${result.success}`);
    console.log(`   📝 Сообщение: ${result.message}`);

    if (result.stats) {
      console.log('\n   📊 Статистика:');
      if (result.stats.copiedFiles) {
        console.log(
          `      - Скопировано файлов: ${result.stats.copiedFiles.length}`
        );
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

    if (result.success) {
      console.log('\n✅ Тест пройден успешно!');
    } else {
      console.log('\n❌ Тест провален!');
      process.exit(1);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Необработанная ошибка:', error);
    process.exit(1);
  }
}

testSync();
