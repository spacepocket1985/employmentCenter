import fs from 'fs/promises';
import path from 'path';
import { oneCConfig } from '../config/oneC.config';

export class FileCopier {
  /**
   * Копирует нужные файлы 1С из источника в локальную папку
   */
  async copyOneCFiles(): Promise<{ success: boolean; copied: string[]; errors: string[] }> {
    const { sourcePath, localPath, filesToCopy } = oneCConfig;
    
    const result = {
      success: true,
      copied: [] as string[],
      errors: [] as string[],
    };

    console.log('📁 Начинаем копирование файлов 1С...');
    console.log(`   Источник: ${sourcePath}`);
    console.log(`   Локальная папка: ${localPath}`);

    try {
      // Создаем локальную папку, если ее нет
      await fs.mkdir(localPath, { recursive: true });

      for (const fileName of filesToCopy) {
        const sourceFile = path.join(sourcePath, fileName);
        const localFile = path.join(localPath, fileName);

        try {
          // Проверяем, существует ли исходный файл
          await fs.access(sourceFile);
          
          // Копируем файл
          await fs.copyFile(sourceFile, localFile);
          result.copied.push(fileName);
          console.log(`   ✅ Скопирован: ${fileName}`);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          result.errors.push(`${fileName}: ${errorMessage}`);
          console.error(`   ❌ Ошибка копирования ${fileName}:`, errorMessage);
          result.success = false;
        }
      }

      console.log(`📊 Итог: скопировано ${result.copied.length} из ${filesToCopy.length} файлов`);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      result.errors.push(`Общая ошибка: ${errorMessage}`);
      result.success = false;
      console.error('❌ Ошибка при копировании:', errorMessage);
      return result;
    }
  }

  /**
   * Проверяет наличие всех нужных файлов
   */
  async checkFiles(): Promise<{ allExist: boolean; missing: string[] }> {
    const { localPath, filesToCopy } = oneCConfig;
    
    const missing: string[] = [];
    
    for (const fileName of filesToCopy) {
      const filePath = path.join(localPath, fileName);
      try {
        await fs.access(filePath);
      } catch {
        missing.push(fileName);
      }
    }

    return {
      allExist: missing.length === 0,
      missing,
    };
  }

  /**
   * Очищает локальную папку с копиями
   */
  async cleanLocalFiles(): Promise<void> {
    const { localPath, filesToCopy } = oneCConfig;
    
    for (const fileName of filesToCopy) {
      const filePath = path.join(localPath, fileName);
      try {
        await fs.unlink(filePath);
        console.log(`   🗑️ Удален: ${fileName}`);
      } catch {
        // Файл уже удален или не существует
      }
    }
  }
}

export const fileCopier = new FileCopier();