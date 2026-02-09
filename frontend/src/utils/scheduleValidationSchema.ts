import * as yup from 'yup';
import { ScheduleType } from 'src/types/schedule.types';

/**
 * Схема для отдельной записи графика с правильной типизацией
 */
export const scheduleEntrySchema = yup.object().shape({
  id: yup.string().required('ID обязателен'),
  employeeId: yup.string().optional(),
  customName: yup
    .string()
    .required('Укажите ФИО сотрудника')
    .min(2, 'ФИО должно содержать минимум 2 символа')
    .max(100, 'ФИО не должно превышать 100 символов'),
  
  customJob: yup
    .string()
    .required('Укажите должность сотрудника')
    .min(2, 'Должность должна содержать минимум 2 символа')
    .max(100, 'Должность не должна превышать 100 символов'),
  
  dates: yup
    .array()
    .of(
      yup
        .string()
        .required('Дата обязательна')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Неверный формат даты. Используйте ГГГГ-ММ-ДД')
        .test('future-date', 'Дата не может быть в прошлом', function(value: string): boolean {
          if (!value) return false;
          try {
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            date.setHours(0, 0, 0, 0);
            return date >= today;
          } catch {
            return false;
          }
        })
        .test('belongs-to-month', 'Дата должна принадлежать выбранному месяцу', function(value: string): boolean {
          if (!value) return false;
          const { month } = this.parent;
          if (!month) return true; // Если месяц не выбран, пропускаем проверку
          return value.startsWith(month);
        })
    )
    .min(1, 'Добавьте хотя бы одну дату дежурства')
    .test('unique-dates', 'Даты не должны повторяться', (dates: string[] | undefined): boolean => {
      if (!dates || dates.length === 0) return true;
      const uniqueDates = new Set(dates);
      return uniqueDates.size === dates.length;
    })
    .default([]),
  
  orderIndex: yup.number().required('Порядковый индекс обязателен'),
});

/**
 * Схема валидации для всей формы создания графика
 */
export const scheduleFormSchema = yup.object().shape({
  month: yup
    .string()
    .required('Выберите месяц для графика')
    .matches(/^\d{4}-\d{2}$/, 'Неверный формат месяца. Используйте ГГГГ-ММ'),
  
  scheduleType: yup
    .mixed<ScheduleType>()
    .oneOf(['responsibleOnWeekends', 'safetyOfficers'] as const, 'Неверный тип графика')
    .required('Выберите тип графика'),
  
  entries: yup
    .array()
    .of(scheduleEntrySchema)
    .min(1, 'Добавьте хотя бы одну запись в график')
    .default([]),
});

/**
 * Тип формы на основе схемы валидации
 */
export type ScheduleFormValues = yup.InferType<typeof scheduleFormSchema>;