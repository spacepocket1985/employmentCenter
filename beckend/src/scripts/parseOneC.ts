import { connectDB } from '../config/db.config';
import { menuParserOneCService } from '../services/menu.parser.1c.service';


async function parseOneC(): Promise<void> {
  console.log('🔄 Запуск ручного парсинга 1С...');
  console.log('='.repeat(60));

  try {
    // Подключаемся к MongoDB
    await connectDB();

    // Запускаем парсинг
    const result = await menuParserOneCService.parseAndSaveMenu();

    console.log('='.repeat(60));
    console.log('📊 Результат:');
    console.log(`   ✅ Успех: ${result.success}`);
    console.log(`   📝 Сообщение: ${result.message}`);
    console.log(`   📊 Статистика:`);
    console.log(
      `      - Всего блюд в справочнике: ${result.stats.totalDishes}`
    );
    console.log(`      - Найдено позиций: ${result.stats.totalItems}`);
    console.log(`      - Сопоставлено: ${result.stats.matchedDishes}`);
    console.log(`      - Не найдено: ${result.stats.notFoundDishes}`);
    console.log(`      - Сохранено дней: ${result.stats.savedDays}`);

    if (result.errors && result.errors.length > 0) {
      console.log(`\n❌ Ошибки (${result.errors.length}):`);
      for (const error of result.errors) {
        console.log(`   - ${error}`);
      }
      process.exit(1);
    }

    console.log('\n✅ Парсинг завершен успешно!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Необработанная ошибка:', error);
    process.exit(1);
  }
}

parseOneC();
