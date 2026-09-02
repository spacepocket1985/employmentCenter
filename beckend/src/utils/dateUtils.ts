/**
 * Утилиты для работы с датами в 1С
 */
export class DateUtils {
  /**
   * Парсит дату из формата 1С (ДДММГГГГ или ГГГГММДД)
   * @param dateStr - Строка даты (например: 01012024 или 20240101)
   * @returns Объект Date или null если не удалось распарсить
   */
  static parseDateFrom1C(dateStr: string): Date | null {
    if (!dateStr || dateStr.length !== 8) {
      return null;
    }

    // Проверяем, что строка состоит только из цифр
    if (!/^\d{8}$/.test(dateStr)) {
      return null;
    }

    // Пробуем формат ДДММГГГГ
    let day = parseInt(dateStr.substring(0, 2), 10);
    let month = parseInt(dateStr.substring(2, 4), 10) - 1;
    let year = parseInt(dateStr.substring(4, 8), 10);

    // Проверяем валидность даты
    let date = new Date(year, month, day);
    if (!isNaN(date.getTime()) && 
        date.getDate() === day && 
        date.getMonth() === month && 
        date.getFullYear() === year) {
      return date;
    }

    // Пробуем формат ГГГГММДД
    year = parseInt(dateStr.substring(0, 4), 10);
    month = parseInt(dateStr.substring(4, 6), 10) - 1;
    day = parseInt(dateStr.substring(6, 8), 10);

    date = new Date(year, month, day);
    if (!isNaN(date.getTime()) && 
        date.getDate() === day && 
        date.getMonth() === month && 
        date.getFullYear() === year) {
      return date;
    }

    return null;
  }

  /**
   * Получает начало дня для указанной даты
   */
  static getStartOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Получает конец дня для указанной даты
   */
  static getEndOfDay(date: Date): Date {
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Получает начало недели (понедельник) для указанной даты
   */
  static getStartOfWeek(date: Date): Date {
    const result = new Date(date);
    const day = result.getDay();
    const diff = (day === 0 ? 7 : day) - 1; // Понедельник - первый день
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Получает конец недели (воскресенье) для указанной даты
   */
  static getEndOfWeek(date: Date): Date {
    const result = this.getStartOfWeek(date);
    result.setDate(result.getDate() + 6);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Получает начало месяца для указанной даты
   */
  static getStartOfMonth(date: Date): Date {
    const result = new Date(date);
    result.setDate(1);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  /**
   * Получает конец месяца для указанной даты
   */
  static getEndOfMonth(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + 1);
    result.setDate(0);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  /**
   * Проверяет, входит ли дата в указанный диапазон
   */
  static isDateInRange(date: Date, dateFrom: Date, dateTo: Date): boolean {
    const normalizedDate = this.getStartOfDay(date);
    const normalizedFrom = this.getStartOfDay(dateFrom);
    const normalizedTo = this.getEndOfDay(dateTo);
    
    return normalizedDate >= normalizedFrom && normalizedDate <= normalizedTo;
  }

  /**
   * Форматирует дату для вывода (ДД.ММ.ГГГГ)
   */
  static formatDate(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return 'некорректная дата';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
  }

  /**
   * Форматирует дату для вывода с временем (ДД.ММ.ГГГГ ЧЧ:ММ)
   */
  static formatDateTime(date: Date): string {
    if (!date || isNaN(date.getTime())) {
      return 'некорректная дата';
    }
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  /**
   * Проверяет, является ли дата валидной
   */
  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  /**
   * Сравнивает две даты (без учета времени)
   * Возвращает:
   * - 0 если даты равны
   * - 1 если date1 > date2
   * - -1 если date1 < date2
   */
  static compareDates(date1: Date, date2: Date): number {
    const d1 = this.getStartOfDay(date1);
    const d2 = this.getStartOfDay(date2);
    
    if (d1.getTime() === d2.getTime()) return 0;
    return d1.getTime() > d2.getTime() ? 1 : -1;
  }

  /**
   * Получает разницу в днях между двумя датами
   */
  static getDaysDiff(date1: Date, date2: Date): number {
    const d1 = this.getStartOfDay(date1);
    const d2 = this.getStartOfDay(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Добавляет дни к дате
   */
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Добавляет месяцы к дате
   */
  static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  /**
   * Получает текущую дату без времени
   */
  static getToday(): Date {
    return this.getStartOfDay(new Date());
  }

  /**
   * Проверяет, является ли дата сегодняшней
   */
  static isToday(date: Date): boolean {
    return this.compareDates(date, new Date()) === 0;
  }

  /**
   * Проверяет, является ли дата в прошлом
   */
  static isPast(date: Date): boolean {
    return this.compareDates(date, new Date()) < 0;
  }

  /**
   * Проверяет, является ли дата в будущем
   */
  static isFuture(date: Date): boolean {
    return this.compareDates(date, new Date()) > 0;
  }
}