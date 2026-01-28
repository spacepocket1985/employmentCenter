// Data Model Layer для графиков

import { Schema, model } from 'mongoose';
import { ScheduleEntry, ScheduleType } from '../types/schedule.types';

const scheduleEntrySchema = new Schema<ScheduleEntry>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      default: null,
    },
    customName: {
      type: String,
      default: '',
    },
    customJob: {
      type: String,
      default: '',
    },
    dates: {
      type: [String],
      required: [true, 'Dates are required for schedule entry'],
      validate: {
        validator: (dates: string[]) => dates.length > 0,
        message: 'At least one date is required',
      },
    },
    orderIndex: {
      type: Number,
      required: [true, 'Order index is required'],
      min: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const scheduleSchema = new Schema<ScheduleType>(
  {
    month: {
      type: String,
      required: [true, 'Month is required'],
      match: [/^\d{4}-\d{2}$/, 'Month must be in format YYYY-MM'],
    },
    scheduleType: {
      type: String,
      required: [true, 'Schedule type is required'],
      enum: ['responsibleOnWeekends', 'safetyOfficers'],
    },
    entries: {
      type: [scheduleEntrySchema],
      default: [],
      validate: {
        validator: (entries: ScheduleEntry[]) => entries.length > 0,
        message: 'At least one entry is required',
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Если у вас есть модель User
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Индекс для быстрого поиска по месяцу и типу
scheduleSchema.index({ month: 1, scheduleType: 1 }, { unique: true });

export const Schedule = model<ScheduleType>('Schedule', scheduleSchema);
