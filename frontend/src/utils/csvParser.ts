import { CSVValidationResult, Menu, DayMenu, Dish } from '../types/menu.types';

// Константы для парсинга
const DATE_REGEX = /^\d{2}\.\d{2}\.\d{2}$/;
const DELIMITER = ';';

// Преобразует строку цены в число
function parsePrice(priceString: string): number {
  if (!priceString || priceString.trim() === '') {
    return 0;
  }
  
  let cleaned = priceString.trim();
  
  cleaned = cleaned.replace(/[₽рpRrubRUB]/gi, '');
  
  if (cleaned.includes('.') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes(' ') && cleaned.includes(',')) {
    cleaned = cleaned.replace(/\s/g, '').replace(',', '.');
  } else {
    cleaned = cleaned.replace(',', '.');
  }
  
  cleaned = cleaned.replace(/[^0-9.\-]/g, '');
  
  const result = parseFloat(cleaned);
  return isNaN(result) ? 0 : result;
}

// Форматирует имя блюда (первая буква заглавная)
function formatDishName(name: string): string {
  if (!name || name.trim() === '') {
    return '';
  }
  
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

// Получает день недели из даты
function getDayOfWeek(dateString: string): string {
  const daysOfWeek = [
    'Воскресенье', 'Понедельник', 'Вторник', 'Среда', 
    'Четверг', 'Пятница', 'Суббота'
  ];
  
  const parts = dateString.split('.');
  if (parts.length !== 3) {
    return '';
  }
  
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = 2000 + parseInt(parts[2], 10);
  
  const date = new Date(year, month, day);
  return daysOfWeek[date.getDay()];
}

// Конвертирует текст CSV в массив строк
function csvTextToRows(csvText: string): string[][] {
  const rows: string[][] = [];
  const lines = csvText.split(/\r\n|\n|\r/);
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const cells = line.split(DELIMITER);
    const row: string[] = [];
    
    cells.forEach((cell) => {
      let value = cell.trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      row.push(value);
    });
    
    rows.push(row);
  }
  
  return rows;
}

// Парсит CSV строки
function parseCSVRows(rows: string[][]): CSVValidationResult {
  const errors: string[] = [];
  const menu: Menu = [];
  
  let currentDayMenu: DayMenu | null = null;
  let dishCounter = 0;
  
  const dataRows = rows.slice(3);
  
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const firstCell = row[0] || '';
    
    if (DATE_REGEX.test(firstCell)) {
      if (currentDayMenu) {
        menu.push(currentDayMenu);
      }
      
      const date = firstCell;
      const dayOfWeek = getDayOfWeek(date);
      
      if (!dayOfWeek) {
        errors.push(`Не удалось определить день недели для даты: ${date} (строка ${i + 4})`);
      }
      
      currentDayMenu = {
        date: date,
        dayOfWeek: dayOfWeek || '',
        dishes: []
      };
      
      dishCounter = 0;
      continue;
    }
    
    if (!firstCell.trim() || !row[1]) {
      continue;
    }
    
    if (currentDayMenu) {
      dishCounter++;
      
      const dishName = formatDishName(row[1] || '');
      const weight = (row[2] || '').trim();
      const priceStr = (row[3] || '').trim();
      const price = parsePrice(priceStr);
      
      if (!dishName) {
        errors.push(`Пустое название блюда (строка ${i + 4})`);
      }
      
      if (!weight) {
        errors.push(`Не указан вес для блюда "${dishName}" (строка ${i + 4})`);
      }
      
      if (price === 0 && priceStr.trim()) {
        errors.push(`Некорректная цена "${priceStr}" для блюда "${dishName}" (строка ${i + 4})`);
      }
      
      const dish: Dish = {
        number: dishCounter,
        name: dishName,
        weight: weight,
        price: price
      };
      
      currentDayMenu.dishes.push(dish);
    } else {
      errors.push(`Блюдо без даты: "${row[1]}" (строка ${i + 4})`);
    }
  }
  
  if (currentDayMenu) {
    menu.push(currentDayMenu);
  }
  
  if (menu.length === 0) {
    errors.push('Не найдено ни одного дня с меню');
  }
  
  const totalDishes = menu.reduce((sum, day) => sum + day.dishes.length, 0);
  if (totalDishes === 0) {
    errors.push('Не найдено ни одного блюда');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    parsedData: menu.length > 0 ? menu : null
  };
}

// Валидирует CSV файл на клиенте перед отправкой
export async function validateCSVFile(file: File): Promise<CSVValidationResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = csvTextToRows(text);
        const result = parseCSVRows(rows);
        resolve(result);
      } catch (error) {
        resolve({
          isValid: false,
          errors: [`Ошибка при чтении файла: ${(error as Error).message}`],
          parsedData: null
        });
      }
    };
    
    reader.onerror = () => {
      resolve({
        isValid: false,
        errors: ['Ошибка при чтении файла'],
        parsedData: null
      });
    };
    
    reader.readAsText(file, 'UTF-8');
  });
}