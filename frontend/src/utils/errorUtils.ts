/**
 * Безопасно преобразует любую ошибку в строковое сообщение
 * Поддерживает разные форматы ошибок:
 * - Строки
 * - Объекты Error
 * - RTK Query ошибки (с полями data.message, error, message)
 * - Любые другие объекты с полем message или error
 */
export const getErrorMessage = (error: unknown): string | null => {
  // Если ошибки нет или она null/undefined
  if (error === undefined || error === null) {
    return null;
  }
  
  // Если ошибка - строка
  if (typeof error === 'string') {
    return error;
  }
  
  // Если ошибка - объект Error
  if (error instanceof Error) {
    return error.message;
  }
  
  // Если ошибка - объект
  if (typeof error === 'object') {
    // Проверяем наличие стандартных полей
    const errorObj = error as Record<string, unknown>;
    
    // Поле message
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }
    
    // Поле error
    if (typeof errorObj.error === 'string') {
      return errorObj.error;
    }
    
    // RTK Query структура: error.data.message или error.data.error
    if (errorObj.data !== null && typeof errorObj.data === 'object') {
      const data = errorObj.data as Record<string, unknown>;
      
      if (typeof data.message === 'string') {
        return data.message;
      }
      
      if (typeof data.error === 'string') {
        return data.error;
      }
    }
    
    // Пробуем преобразовать в строку другими способами
    try {
      const stringified = JSON.stringify(error);
      if (stringified !== '{}') {
        return stringified;
      }
    } catch {
      // Игнорируем ошибки JSON.stringify
    }
  }
  
  // Последняя попытка - преобразовать через String()
  try {
    const stringValue = String(error);
    if (stringValue !== '[object Object]') {
      return stringValue;
    }
  } catch {
    // Игнорируем ошибки преобразования
  }
  
  return 'Произошла неизвестная ошибка';
};

/**
 * Проверяет, есть ли ошибка
 */
export const hasError = (error: unknown): boolean => {
  return error !== undefined && error !== null;
};

/**
 * Получает сообщение об ошибке, если она есть
 */
export const getErrorIfExists = (error: unknown): string | null => {
  return hasError(error) ? getErrorMessage(error) : null;
};