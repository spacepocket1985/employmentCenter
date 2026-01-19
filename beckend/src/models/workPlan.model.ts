import mongoose, { Schema, Document } from 'mongoose';

// Схема мероприятия
const EventSchema = new Schema({
  id: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  responsiblePersons: [{ type: String }],
  notes: { type: String }
});

// Схема анонса
const AnnouncementSchema = new Schema({
  id: { type: String, required: true },
  dayNumber: { type: Number, required: true },
  title: { type: String, required: true },
  style: { 
    type: String, 
    enum: ['warning', 'info', 'success', 'primary'],
    default: 'info'
  },
  order: { type: Number, default: 0 }
});

// Схема дня плана
const DayPlanSchema = new Schema({
  id: { type: String, required: true },
  dayNumber: { type: Number, required: true },
  dayOfWeek: { type: String, required: true },
  isSpecialDay: { type: Boolean, default: false },
  specialDayTitle: { type: String },
  events: [EventSchema]
});

// Основная схема плана
const WorkPlanSchema = new Schema({
  month: { type: String, required: true },
  monthNumber: { type: Number, required: true, min: 1, max: 12 },
  year: { type: Number, required: true },
  days: [DayPlanSchema],
  announcements: [AnnouncementSchema] // Новое поле
}, {
  timestamps: true
});


// Индекс для поиска по году и месяцу
WorkPlanSchema.index({ year: 1, monthNumber: 1 }, { unique: true });

export interface IWorkPlan extends Document {
  month: string;
  monthNumber: number;
  year: number;
  days: Array<{
    id: string;
    dayNumber: number;
    dayOfWeek: string;
    isSpecialDay?: boolean;
    specialDayTitle?: string;
    events: Array<{
      id: string;
      time: string;
      description: string;
      responsiblePersons: string[];
      notes?: string;
    }>;
  }>;
  announcements: Array<{ // Новое поле
    id: string;
    dayNumber: number;
    title: string;
    style?: 'warning' | 'info' | 'success' | 'primary';
    order?: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

WorkPlanSchema.pre('save', function(next) {
  // Обрабатываем специальные дни перед сохранением
  this.days.forEach(day => {
    if (day.isSpecialDay && day.specialDayTitle) {
      // Для специальных дней автоматически создаем мероприятие с названием
      if (day.events.length === 0) {
        day.events.push({
          id: new mongoose.Types.ObjectId().toString(),
          time: 'Весь день',
          description: day.specialDayTitle,
          responsiblePersons: []
        });
      } else if (day.events.length === 1) {
        // Если уже есть одно мероприятие, убедимся что у него есть время
        if (!day.events[0].time || day.events[0].time.trim() === '') {
          day.events[0].time = 'Весь день';
        }
      }
    }
  });
  next();
});

export const WorkPlanModel = mongoose.model<IWorkPlan>('WorkPlan', WorkPlanSchema);