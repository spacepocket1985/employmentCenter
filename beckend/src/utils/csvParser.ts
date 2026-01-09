import { ICSVRow, ICSVValidationResult, IDayMenu, IDish } from '../types/menu.types';

export class CSVParser {
  private static readonly DATE_REGEX = /^\d{2}\.\d{2}\.\d{2}$/;
  private static readonly DELIMITER = ';';
  
  static parsePrice(priceString: string): number {
    if (!priceString || priceString.trim() === '') {
      return 0;
    }
    
    let cleaned = priceString.trim();
    
    // Убираем символы валюты если есть
    cleaned = cleaned.replace(/[₽рpRrubRUB]/gi, '');
    
    // Определяем формат числа
    if (cleaned.includes('.') && cleaned.includes(',')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (cleaned.includes(' ') && cleaned.includes(',')) {
      cleaned = cleaned.replace(/\s/g, '').replace(',', '.');
    } else {
      cleaned = cleaned.replace(',', '.');
    }
    
    // Убираем все нечисловые символы кроме точки и минуса
    cleaned = cleaned.replace(/[^0-9.\-]/g, '');
    
    const result = parseFloat(cleaned);
    return isNaN(result) ? 0 : result;
  }
  
  static formatDishName(name: string): string {
    if (!name || name.trim() === '') {
      return '';
    }
    
    const trimmed = name.trim();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  }
  
  static getDayOfWeek(dateString: string): string {
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
  
  static parseCSV(csvRows: ICSVRow[]): ICSVValidationResult {
    const errors: string[] = [];
    const menu: IDayMenu[] = [];
    
    let currentDayMenu: IDayMenu | null = null;
    let dishCounter = 0;
    
    // Пропускаем заголовки (первые 3 строки)
    const dataRows = csvRows.slice(3);
    
    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const firstCell = row[0] || '';
      
      // Проверяем, является ли строка датой
      if (this.DATE_REGEX.test(firstCell)) {
        if (currentDayMenu) {
          menu.push(currentDayMenu);
        }
        
        const date = firstCell;
        const dayOfWeek = this.getDayOfWeek(date);
        
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
        
        const dishName = this.formatDishName(row[1] || '');
        const weight = (row[2] || '').trim();
        const priceStr = (row[3] || '').trim();
        const price = this.parsePrice(priceStr);
        
        if (!dishName) {
          errors.push(`Пустое название блюда (строка ${i + 4})`);
        }
        
        if (!weight) {
          errors.push(`Не указан вес для блюда "${dishName}" (строка ${i + 4})`);
        }
        
        if (price === 0 && priceStr.trim()) {
          errors.push(`Некорректная цена "${priceStr}" для блюда "${dishName}" (строка ${i + 4})`);
        }
        
        const dish: IDish = {
          number: dishCounter,
          name: dishName,
          weight: weight,
          price: price,
          originalPrice: priceStr
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
  
  static csvTextToRows(csvText: string): ICSVRow[] {
    const rows: ICSVRow[] = [];
    const lines = csvText.split(/\r\n|\n|\r/);
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const cells = line.split(this.DELIMITER);
      const row: ICSVRow = {};
      
      cells.forEach((cell, index) => {
        let value = cell.trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        
        // Используем type assertion для индексов
        if (index === 0) row[0] = value;
        else if (index === 1) row[1] = value;
        else if (index === 2) row[2] = value;
        else if (index === 3) row[3] = value;
      });
      
      rows.push(row);
    }
    
    return rows;
  }
}