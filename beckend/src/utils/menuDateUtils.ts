/**
 * Утилиты для работы с датами в меню
 */
export class MenuDateUtils {
  /**
   * Конвертирует дату из формата ДД.ММ.ГГГГ в ДД.ММ.ГГ
   */
  static toShortFormat(date: string): string {
    if (!date) return '';
    // Если уже в коротком формате (ДД.ММ.ГГ)
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(date)) {
      return date;
    }
    // Если в длинном формате (ДД.ММ.ГГГГ)
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      return date.slice(0, 8); // берем первые 8 символов
    }
    return date;
  }

  /**
   * Конвертирует дату из формата ДД.ММ.ГГ в ДД.ММ.ГГГГ
   */
  static toLongFormat(date: string): string {
    if (!date) return '';
    // Если уже в длинном формате
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(date)) {
      return date;
    }
    // Если в коротком формате (ДД.ММ.ГГ)
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(date)) {
      const [day, month, year] = date.split('.');
      const fullYear = `20${year}`;
      return `${day}.${month}.${fullYear}`;
    }
    return date;
  }

  /**
   * Получает название дня недели по дате
   */
  static getDayOfWeek(dateStr: string): string {
    const [day, month, year] = dateStr.split('.');
    const fullYear = year.length === 2 ? `20${year}` : year;
    const date = new Date(
      parseInt(fullYear),
      parseInt(month) - 1,
      parseInt(day)
    );

    const days = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
    ];

    return days[date.getDay()];
  }

  /**
   * Проверяет, является ли дата валидной в формате ДД.ММ.ГГ или ДД.ММ.ГГГГ
   */
  static isValidDate(dateStr: string): boolean {
    if (!dateStr) return false;
    const format = /^\d{2}\.\d{2}\.\d{2}$/;
    const formatLong = /^\d{2}\.\d{2}\.\d{4}$/;

    if (!format.test(dateStr) && !formatLong.test(dateStr)) {
      return false;
    }

    const [day, month, year] = dateStr.split('.');
    const fullYear = year.length === 2 ? `20${year}` : year;
    const date = new Date(
      parseInt(fullYear),
      parseInt(month) - 1,
      parseInt(day)
    );

    return (
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(fullYear)
    );
  }

  /**
   * Преобразует дату из формата ДД.ММ.ГГГГ в ДД.ММ.ГГ
   * Пример: "31.08.2026" → "31.08.26"
   */
  static from1CDate(dateStr: string): string {
    if (!dateStr) return '';

    // Уже в формате ДД.ММ.ГГ
    if (/^\d{2}\.\d{2}\.\d{2}$/.test(dateStr)) {
      return dateStr;
    }

    // Из формата ДД.ММ.ГГГГ → ДД.ММ.ГГ
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split('.');
      const shortYear = year.slice(-2); // берем последние 2 цифры
      return `${day}.${month}.${shortYear}`;
    }

    return dateStr;
  }
}
