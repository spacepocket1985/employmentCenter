
import cron from 'node-cron';
import { fileCopier } from '../utils/fileCopier';

import { oneCConfig } from '../config/oneC.config';
import { connectDB } from '../config/db.config';
import { menuParserOneCService } from '../services/menu.parser.1c.service';

export type TSyncMenuResult = {
  success: boolean;
  message: string;
  stats?: {
    totalDays?: number;
    totalDishes?: number;
    copiedFiles?: string[];
    errors?: string[];
  };
};

/**
 * Полный цикл синхронизации меню с 1С:
 * 1. Копирование файлов
 * 2. Парсинг в MongoDB
 */
export async function syncMenu(): Promise<TSyncMenuResult> {
  const startTime = Date.now();

  console.log('🔄 Запуск синхронизации меню с 1С...');
  console.log('='.repeat(60));

  try {
    await connectDB();

    // Шаг 1: Копирование файлов
    console.log('📁 Шаг 1: Копирование файлов 1С...');
    const copyResult = await fileCopier.copyOneCFiles();

    if (!copyResult.success) {
      console.error('❌ Ошибка при копировании файлов:');
      for (const error of copyResult.errors) {
        console.error(`   - ${error}`);
      }

      return {
        success: false,
        message: 'Ошибка при копировании файлов 1С',
        stats: {
          copiedFiles: copyResult.copied,
          errors: copyResult.errors,
        },
      };
    }

    // Шаг 2: Парсинг в MongoDB
    console.log('\n📊 Шаг 2: Парсинг меню 1С в MongoDB...');
    const parseResult = await menuParserOneCService.parseAndSaveMenu();

    if (!parseResult.success) {
      console.error('❌ Ошибка при парсинге:', parseResult.message);

      return {
        success: false,
        message: 'Ошибка при парсинге меню 1С',
        stats: {
          copiedFiles: copyResult.copied,
          errors: parseResult.errors,
          totalDays: parseResult.stats.totalDays,
          totalDishes: parseResult.stats.totalItems,
        },
      };
    }

    const duration = Date.now() - startTime;

    console.log('\n✅ Синхронизация меню с 1С завершена успешно!');
    console.log(`   ⏱️  Длительность: ${duration}мс`);
    console.log(`   📁 Скопировано файлов: ${copyResult.copied.length}`);
    console.log(`   📅 Сохранено дней: ${parseResult.stats.savedDays}`);
    console.log(`   🍽️  Сохранено блюд: ${parseResult.stats.totalItems}`);

    return {
      success: true,
      message: 'Синхронизация меню с 1С завершена успешно',
      stats: {
        copiedFiles: copyResult.copied,
        totalDays: parseResult.stats.savedDays,
        totalDishes: parseResult.stats.totalItems,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error('❌ Необработанная ошибка:', errorMessage);

    return {
      success: false,
      message: 'Необработанная ошибка при синхронизации меню',
      stats: { errors: [errorMessage] },
    };
  }
}

/**
 * Запускает ежедневную синхронизацию меню (в 06:00)
 */
export function startDailyMenuSync(): void {
  const { menuParseCron } = oneCConfig;

  console.log(`⏰ Запланирована ежедневная синхронизация меню с 1С в ${menuParseCron}`);

  cron.schedule(menuParseCron, async () => {
    console.log(`\n📅 Ежедневная синхронизация меню (${new Date().toLocaleString()})`);
    await syncMenu();
  });
}

/**
 * Запускает пятничную синхронизацию меню (в 17:00)
 */
export function startFridayMenuSync(): void {
  const { menuParseCronFriday } = oneCConfig;

  console.log(`⏰ Запланирована пятничная синхронизация меню с 1С в ${menuParseCronFriday}`);

  cron.schedule(menuParseCronFriday, async () => {
    console.log(`\n📅 Пятничная синхронизация меню (${new Date().toLocaleString()})`);
    await syncMenu();
  });
}

/**
 * Запускает все планировщики синхронизации меню
 */
export function startMenuSyncJobs(): void {
  console.log('🔄 Запуск планировщиков синхронизации меню с 1С...');
  console.log('='.repeat(60));

  startDailyMenuSync();
  startFridayMenuSync();

  console.log('✅ Планировщики синхронизации меню запущены');
}

/**
 * Ручной запуск синхронизации меню (из API)
 */
export async function manualMenuSync(): Promise<TSyncMenuResult> {
  console.log('🔄 Ручной запуск синхронизации меню с 1С...');
  return syncMenu();
}