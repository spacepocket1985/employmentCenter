import { 
  TimeValue, 
  DayType,
  isSimpleTime, 
  isRangeTime, 
  isTextTime, 
  isContinuedTime,
  isDaySpecificTime 
} from 'src/types/busRoute.types';

/**
 * Метки для типов дней (короткие)
 */
const DAY_TYPE_SHORT_LABELS: Record<DayType, string> = {
  working: 'Раб',
  weekend: 'Вых',
  holiday: 'Празд',
  monday_thursday: 'Пн-Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

/**
 * Метки для типов дней (полные)
 */
const DAY_TYPE_FULL_LABELS: Record<DayType, string> = {
  working: 'Рабочие дни',
  weekend: 'Выходные дни',
  holiday: 'Праздничные дни',
  monday_thursday: 'Понедельник-Четверг',
  friday: 'Пятница',
  saturday: 'Суббота',
  sunday: 'Воскресенье',
};

/**
 * Форматирует TimeValue для отображения
 */
export const formatTimeValue = (value: TimeValue, format: 'short' | 'full' = 'short'): string => {
  const labels = format === 'short' ? DAY_TYPE_SHORT_LABELS : DAY_TYPE_FULL_LABELS;
  
  if (isSimpleTime(value)) {
    return value.simpleTime;
  }
  
  if (isRangeTime(value)) {
    const fromLabel = labels[value.dayRange.from];
    const toLabel = labels[value.dayRange.to];
    return `${fromLabel}-${toLabel} ${value.dayRange.time}`;
  }
  
  if (isTextTime(value)) {
    return value.text;
  }
  
  if (isContinuedTime(value)) {
    return '⏭️ Далее по маршруту';
  }
  
  if (isDaySpecificTime(value)) {
    const parts: string[] = [];
    
    if (value.daySpecific.monday_thursday) {
      parts.push(`Пн-Чт ${value.daySpecific.monday_thursday}`);
    }
    if (value.daySpecific.friday) {
      parts.push(`Пт ${value.daySpecific.friday}`);
    }
    if (value.daySpecific.saturday) {
      parts.push(`Сб ${value.daySpecific.saturday}`);
    }
    if (value.daySpecific.sunday) {
      parts.push(`Вс ${value.daySpecific.sunday}`);
    }
    if (value.daySpecific.working) {
      parts.push(`Раб ${value.daySpecific.working}`);
    }
    if (value.daySpecific.weekend) {
      parts.push(`Вых ${value.daySpecific.weekend}`);
    }
    if (value.daySpecific.holiday) {
      parts.push(`Празд ${value.daySpecific.holiday}`);
    }
    
    return parts.join(' / ');
  }
  
  return '';
};

/**
 * Проверяет, заполнено ли TimeValue
 */
export const isTimeValueFilled = (value: TimeValue): boolean => {
  if (isSimpleTime(value)) {
    return Boolean(value.simpleTime?.trim());
  }
  
  if (isRangeTime(value)) {
    return Boolean(
      value.dayRange.from && 
      value.dayRange.to && 
      value.dayRange.time?.trim()
    );
  }
  
  if (isTextTime(value)) {
    return Boolean(value.text?.trim());
  }
  
  if (isContinuedTime(value)) {
    return true;
  }
  
  if (isDaySpecificTime(value)) {
    return Object.values(value.daySpecific).some(v => Boolean(v?.trim()));
  }
  
  return false;
};

/**
 * Создает пустое TimeValue по умолчанию
 */
export const createEmptyTimeValue = (type: TimeValue['type'] = 'simple'): TimeValue => {
  switch (type) {
    case 'simple':
      return { type: 'simple', simpleTime: '' };
      
    case 'range':
      return { 
        type: 'range', 
        dayRange: { 
          from: 'working', 
          to: 'working', 
          time: '' 
        } 
      };
      
    case 'text':
      return { type: 'text', text: '' };
      
    case 'continued':
      return { type: 'continued', isContinued: true };
      
    case 'daySpecific':
      return { 
        type: 'daySpecific', 
        daySpecific: {} 
      };
      
    default:
      return { type: 'simple', simpleTime: '' };
  }
};

/**
 * Валидирует формат времени ЧЧ:ММ или ЧЧ.ММ
 */
export const isValidTimeFormat = (time: string): boolean => {
  // Поддерживаем оба разделителя: : и .
  return /^([0-1]?[0-9]|2[0-3])[:.][0-5][0-9]$/.test(time);
};

/**
 * Нормализует время к формату ЧЧ:ММ
 */
export const normalizeTime = (time: string): string => {
  return time.replace('.', ':');
};

/**
 * Получает метку для типа дня
 */
export const getDayTypeLabel = (dayType: DayType, format: 'short' | 'full' = 'short'): string => {
  return format === 'short' 
    ? DAY_TYPE_SHORT_LABELS[dayType] 
    : DAY_TYPE_FULL_LABELS[dayType];
};

/**
 * Получает все доступные типы дней для селекта
 */
export const getAllDayTypes = (): { value: DayType; label: string }[] => {
  return Object.keys(DAY_TYPE_FULL_LABELS).map((key) => ({
    value: key as DayType,
    label: DAY_TYPE_FULL_LABELS[key as DayType],
  }));
};