import * as yup from 'yup';
import { BusRouteFormValues } from 'src/types/busRoute.types';

const timeValueSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(['simple', 'range', 'text', 'continued', 'daySpecific'])
    .required(),
  simpleTime: yup.string().when('type', {
    is: 'simple',
    then: (schema) =>
      schema
        .required('Время обязательно')
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
    otherwise: (schema) => schema.notRequired(),
  }),
  dayRange: yup.object().when('type', {
    is: 'range',
    then: (schema) =>
      schema.shape({
        from: yup.string().required(),
        to: yup.string().required(),
        time: yup
          .string()
          .required()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  daySpecific: yup.object().when('type', {
    is: 'daySpecific',
    then: (schema) =>
      schema.shape({
        monday_thursday: yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
        friday: yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
        saturday: yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
        sunday: yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
        working: yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
        weekend: yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Формат ЧЧ:ММ'),
      }),
    otherwise: (schema) => schema.notRequired(),
  }),
  text: yup.string().when('type', {
    is: 'text',
    then: (schema) => schema.required('Текст обязателен'),
    otherwise: (schema) => schema.notRequired(),
  }),
  isContinued: yup.boolean().when('type', {
    is: 'continued',
    then: (schema) => schema.isTrue(),
    otherwise: (schema) => schema.notRequired(),
  }),
});

// Валидация остановки с учетом специальной отметки
const busStopSchema = yup.object().shape({
  id: yup.string().required(),
  orderNumber: yup.number().required().positive(),
  name: yup
    .string()
    .when('isSpecialNote', {
      is: true,
      then: (schema) =>
        schema
          .required('Название отметки обязательно')
          .min(2, 'Минимум 2 символа'),
      otherwise: (schema) =>
        schema
          .required('Название остановки обязательно')
          .min(2, 'Минимум 2 символа'),
    })
    .max(100, 'Максимум 100 символов'),
  address: yup.string().when('isSpecialNote', {
    is: true,
    then: (schema) => schema.notRequired(), // Для спец. отметок адрес не обязателен
    otherwise: (schema) =>
      schema.required('Адрес остановки обязателен').min(3, 'Минимум 3 символа'),
  }),
  time: timeValueSchema,
  isSpecialNote: yup.boolean(),
});

// Валидация транспортного средства
const vehicleSchema = yup.object().shape({
  id: yup.string().required(),
  model: yup
    .string()
    .required('Модель ТС обязательна')
    .min(2, 'Минимум 2 символа'),
  capacity: yup.number().positive().optional(),
});

// Валидация типов дней
const dayTypeSchema = yup
  .string()
  .oneOf([
    'working',
    'weekend',
    'holiday',
    'monday_thursday',
    'friday',
    'saturday',
    'sunday',
  ]);

// Валидация записи расписания
const scheduleEntrySchema = yup.object().shape({
  id: yup.string().required(),
  period: yup.string().oneOf(['morning', 'evening']).required(),
  dayTypes: yup
    .array()
    .of(dayTypeSchema)
    .min(1, 'Выберите хотя бы один тип дня'),
  vehicles: yup.array().of(vehicleSchema).min(1, 'Укажите хотя бы одно ТС'),
  busStops: yup
    .array()
    .of(busStopSchema)
    .min(1, 'Добавьте хотя бы одну остановку')
    .test(
      'unique-order-numbers',
      'Номера остановок должны быть уникальны',
      (stops) => {
        if (!stops) return true;
        const numbers = stops.map((s) => s.orderNumber);
        return new Set(numbers).size === numbers.length;
      }
    ),
  notes: yup.string().optional(),
});

// Основная схема маршрута
export const busRoutesValidationSchema = yup.object().shape({
  routeNumber: yup
    .string()
    .required('Номер маршрута обязателен')
    .matches(/^[1-9][0-9]*$/, 'Номер должен быть положительным числом'),
  routeName: yup.string().optional(),
  schedules: yup
    .array()
    .of(scheduleEntrySchema)
    .min(1, 'Добавьте хотя бы одно расписание'),
  isActive: yup.boolean(),
}) as yup.ObjectSchema<BusRouteFormValues>;
