import { DBFFile } from 'dbffile';
import { TDbfRecord } from '../types/oneC.types';

/**
 * Читает DBF-файл и возвращает массив записей.
 * @param filePath - Полный путь к .DBF файлу.
 * @param encoding - Кодировка файла (для 1С обычно 'cp1251').
 * @returns Массив объектов, где ключи - это имена полей.
 */
export async function readDbfFile(
  filePath: string,
  encoding: string = 'cp1251'
): Promise<TDbfRecord[]> {
  console.log(`📁 Чтение файла 1С: ${filePath}`);
  console.log(`📌 Используемая кодировка: ${encoding}`);

  try {
    // DBFFile.open с кодировкой cp1251 уже декодирует строки
    const dbf = await DBFFile.open(filePath, { encoding });
    const records = await dbf.readRecords(dbf.recordCount);

    // Преобразуем записи
    const convertedRecords: TDbfRecord[] = records.map((record) => {
      const converted: TDbfRecord = {};

      for (const [key, value] of Object.entries(record)) {
        // Пропускаем служебное поле DELETED
        if (key === 'DELETED') {
          continue;
        }

        // Преобразуем значение в нужный тип
        if (value === null || value === undefined) {
          converted[key] = null;
        } else if (typeof value === 'string') {
          // НЕ декодируем повторно! DBFFile уже декодировал
          // Только очищаем от лишних символов
          converted[key] = value.replace(/\x00/g, '').trim();
        } else if (typeof value === 'number') {
          converted[key] = value;
        } else if (typeof value === 'boolean') {
          converted[key] = value ? 1 : 0;
        } else {
          converted[key] = String(value);
        }
      }

      return converted;
    });

    console.log(
      `✅ Прочитано ${convertedRecords.length} записей из ${
        filePath.split('/').pop() || filePath
      }`
    );

    // Выводим пример первой записи для проверки
    if (convertedRecords.length > 0) {
      const firstRecord = convertedRecords[0];
      console.log('📝 Пример первой записи:');
      for (const [key, value] of Object.entries(firstRecord)) {
        if (
          typeof value === 'string' &&
          value.length > 0 &&
          value.length < 100
        ) {
          console.log(`  ${key}: ${value}`);
          break; // Показываем только первое поле
        }
      }
    }

    return convertedRecords;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Неизвестная ошибка';
    console.error(`❌ Ошибка чтения DBF-файла ${filePath}:`, errorMessage);
    throw new Error(
      `Не удалось прочитать файл 1С: ${filePath.split('/').pop() || filePath}`
    );
  }
}
