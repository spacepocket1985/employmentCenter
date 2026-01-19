import { LocalDayPlan } from 'src/types/workPlan.types';

export type ValidationError = {
  dayNumber: number;
  dayOfWeek: string;
  eventIndex: number;
  field: 'time' | 'description' | 'responsiblePersons';
  message: string;
};

export const validateWorkPlan = (days: LocalDayPlan[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  days.forEach((day) => {
    // Для специальных дней проверяем только обычные мероприятия (начиная со второго)
    const eventsToValidate = day.isSpecialDay ? day.events.slice(1) : day.events;
    
    eventsToValidate.forEach((event, eventIndex) => {
      // Для специальных дней eventIndex начинается с 2
      const actualEventIndex = day.isSpecialDay ? eventIndex + 2 : eventIndex + 1;

      // Проверка времени
      if (!event.time || event.time.trim() === '') {
        errors.push({
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          eventIndex: actualEventIndex,
          field: 'time',
          message: 'Не указано время мероприятия',
        });
      } else if (!isValidTimeFormat(event.time)) {
        errors.push({
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          eventIndex: actualEventIndex,
          field: 'time',
          message: 'Неверный формат времени. Используйте HH:mm',
        });
      }

      // Проверка описания мероприятия
      if (!event.description || event.description.trim() === '') {
        errors.push({
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          eventIndex: actualEventIndex,
          field: 'description',
          message: 'Не указано мероприятие',
        });
      }

      // Проверка ответственных
      if (!event.responsiblePersons || event.responsiblePersons.length === 0) {
        errors.push({
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          eventIndex: actualEventIndex,
          field: 'responsiblePersons',
          message: 'Не указаны ответственные лица',
        });
      }
    });
  });

  return errors;
};

export const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

export const getErrorSummary = (errors: ValidationError[]): string => {
  if (errors.length === 0) return '';

  const dayErrors = new Set(errors.map((e) => e.dayNumber)).size;
  const eventErrors = errors.length;

  return `Найдено ${eventErrors} ошибок в ${dayErrors} днях`;
};

export const groupErrorsByDay = (
  errors: ValidationError[]
): Record<number, ValidationError[]> => {
  return errors.reduce((groups, error) => {
    if (!groups[error.dayNumber]) {
      groups[error.dayNumber] = [];
    }
    groups[error.dayNumber].push(error);
    return groups;
  }, {} as Record<number, ValidationError[]>);
};
