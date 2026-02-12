import * as yup from 'yup';
import { ScheduleType } from 'src/types/schedule.types';

/**
 * Схема для отдельной записи графика
 */
export const scheduleEntrySchema = yup.object().shape({
  id: yup
    .string()
    .required('ID обязателен')
    .defined(),

  customName: yup
    .string()
    .required('Укажите ФИО сотрудника')
    .min(2, 'ФИО должно содержать минимум 2 символа')
    .max(100, 'ФИО не должно превышать 100 символов')
    .trim()
    .defined(),

  customJob: yup
    .string()
    .required('Укажите должность сотрудника')
    .min(2, 'Должность должна содержать минимум 2 символа')
    .max(100, 'Должность не должна превышать 100 символов')
    .trim()
    .defined(),

  dates: yup
    .array()
    .of(
      yup
        .string()
        .required('Дата обязательна')
        .matches(
          /^\d{4}-\d{2}-\d{2}$/,
          'Неверный формат даты. Используйте ГГГГ-ММ-ДД'
        )
        .defined()
    )
    .min(1, 'Добавьте хотя бы одну дату дежурства')
    .defined()
    .default([]),

  orderIndex: yup
    .number()
    .required('Порядковый индекс обязателен')
    .integer('Порядковый индекс должен быть целым числом')
    .min(0, 'Порядковый индекс не может быть отрицательным')
    .defined()
    .default(0),
});

/**
 * Схема валидации для всей формы создания/редактирования графика
 */
export const scheduleFormSchema = yup.object().shape({
  month: yup
    .string()
    .required('Выберите месяц для графика')
    .matches(/^\d{4}-\d{2}$/, 'Неверный формат месяца. Используйте ГГГГ-ММ')
    .defined(),

  scheduleType: yup
    .mixed<ScheduleType>()
    .oneOf(
      ['responsibleOnWeekends', 'safetyOfficers'] as const,
      'Выберите корректный тип графика'
    )
    .required('Выберите тип графика')
    .defined(),

  entries: yup
    .array()
    .of(scheduleEntrySchema)
    .min(1, 'Добавьте хотя бы одну запись в график')
    .defined()
    .default([]),
});

/**
 * Тип формы на основе схемы валидации
 */
export type ScheduleFormValues = yup.InferType<typeof scheduleFormSchema>;