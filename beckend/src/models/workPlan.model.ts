import mongoose, { Schema, Document, Types } from 'mongoose';
import { WorkPlan } from '../types/workPlan.types';

export type WorkPlanDocument = WorkPlan & Document;

// Схема мероприятия
const EventSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    time: {
      type: String,
      required: true,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    responsiblePersons: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { _id: false }
);

// Схема дня
const DayPlanSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      default: () => new Types.ObjectId().toString(),
    },
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 31,
    },
    dayOfWeek: {
      type: String,
      required: true,
      enum: [
        'понедельник',
        'вторник',
        'среда',
        'четверг',
        'пятница',
        'суббота',
        'воскресенье',
      ],
    },
    isSpecialDay: {
      type: Boolean,
      default: false,
    },
    specialDayTitle: {
      type: String,
      default: '',
      trim: true,
    },
    events: [EventSchema],
  },
  { _id: false }
);

// Основная схема
const WorkPlanSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
      index: true,
    },
    monthNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
      index: true,
    },
    year: {
      type: Number,
      required: true,
      min: 2000,
      max: 2100,
      index: true,
    },
    days: {
      type: [DayPlanSchema],
      required: true,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'work_plans',
  }
);

// Индексы для быстрого поиска
WorkPlanSchema.index({ year: 1, monthNumber: 1 });

export const WorkPlanModel = mongoose.model<WorkPlanDocument>(
  'WorkPlan',
  WorkPlanSchema
);
