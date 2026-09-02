import { fileCopier } from '../utils/fileCopier';

async function copyOneCFiles() {
  console.log('🔄 Запуск копирования файлов 1С...');
  console.log('='.repeat(60));

  const result = await fileCopier.copyOneCFiles();

  console.log('='.repeat(60));
  console.log('📊 Результат:');
  console.log(`   ✅ Успешно: ${result.copied.length}`);
  console.log(`   ❌ Ошибок: ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Список ошибок:');
    for (const error of result.errors) {
      console.log(`   - ${error}`);
    }
    process.exit(1);
  }

  console.log('\n✅ Все файлы скопированы успешно!');
  process.exit(0);
}

copyOneCFiles().catch((error) => {
  console.error('❌ Необработанная ошибка:', error);
  process.exit(1);
});