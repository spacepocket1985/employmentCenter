import { Schema, model } from 'mongoose';
import {
  BusRouteType,
  BusStop,
  TimeValue,
  ScheduleEntry,
  VehicleType,
} from '../types/busRoute.types';

// Схема для сложного формата времени
const timeValueSchema = new Schema<TimeValue>(
  {
    type: {
      type: String,
      enum: ['simple', 'range', 'text', 'continued'],
      required: true,
    },
    simpleTime: {
      type: String,
      required: function (this: TimeValue) {
        return this.type === 'simple';
      },
    },
    dayRange: {
      from: {
        type: String,
        enum: [
          'working',
          'weekend',
          'holiday',
          'monday_thursday',
          'friday',
          'saturday',
          'sunday',
        ],
      },
      to: {
        type: String,
        enum: [
          'working',
          'weekend',
          'holiday',
          'monday_thursday',
          'friday',
          'saturday',
          'sunday',
        ],
      },
      time: String,
    },
    daySpecific: {
      monday_thursday: String,
      friday: String,
      saturday: String,
      sunday: String,
      working: String,
      weekend: String,
    },
    text: String,
    isContinued: Boolean,
  },
  { _id: false }
);

// Схема для остановки
const busStopSchema = new Schema<BusStop>(
  {
    orderNumber: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    time: {
      type: timeValueSchema,
      required: true,
    },
    isSpecialNote: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// Схема для транспортного средства
const vehicleTypeSchema = new Schema<VehicleType>(
  {
    model: {
      type: String,
      required: true,
    },
    capacity: Number,
  },
  { _id: false }
);

// Схема для записи расписания
const scheduleEntrySchema = new Schema<ScheduleEntry>(
  {
    period: {
      type: String,
      enum: ['morning', 'evening'],
      required: true,
    },
    dayTypes: [
      {
        type: String,
        enum: [
          'working',
          'weekend',
          'holiday',
          'monday_thursday',
          'friday',
          'saturday',
          'sunday',
        ],
        required: true,
      },
    ],
    vehicles: [vehicleTypeSchema],
    busStops: [busStopSchema],
    notes: String,
  },
  { _id: true }
);

// Основная схема маршрута
const busRouteSchema = new Schema<BusRouteType>(
  {
    routeNumber: {
      type: String,
      required: true,
      index: true,
    },
    routeName: String,
    description: String,
    schedules: [scheduleEntrySchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Составной индекс для уникальности номера маршрута
busRouteSchema.index({ routeNumber: 1 }, { unique: true });

export const BusRoute = model<BusRouteType>('BusRoute', busRouteSchema);
