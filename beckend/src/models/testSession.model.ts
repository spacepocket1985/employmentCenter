// Data Model Layer:
// Description: Defines the data structure for logged test sessions.
// Используется для логирования результатов именных тестов (День мастера, аттестация и т.д.)

import { Schema, model, ObjectId } from 'mongoose';

// ============================================
// ТИПЫ
// ============================================

/**
 * Баллы по одной шкале
 */
export type TestSessionScaleScoreType = {
  scaleId: string;
  score: number;
  maxScore: number;
  percentage: number;
};

/**
 * Интерпретация для одной шкалы
 */
export type TestSessionScaleInterpretationType = {
  scaleId: string;
  interpretation: {
    title: string;
    description: string;
    recommendations?: string[];
  };
};

/**
 * Общая интерпретация
 */
export type TestSessionInterpretationType = {
  title: string;
  description: string;
  recommendations?: string[];
};

/**
 * Ответ на один вопрос в сессии
 */
export type TestSessionAnswerType = {
  questionId: string;
  questionText: string;
  questionType: 'single' | 'multiple';
  optionIds: string[];
  optionTexts: string[];
  score: number;
};

/**
 * Тип сессии:
 * - registered: сотрудник выбран из списка или найден по ФИО
 * - manual: сотрудник введён вручную, не найден в базе
 */
export type TestSessionTypeEnum = 'registered' | 'manual';

/**
 * Полная модель сессии теста (для логирования)
 */
export type TestSessionType = {
  _id: ObjectId;

  // ============================================
  // КТО ПРОХОДИЛ
  // ============================================
  /** ID сотрудника (null для manual) */
  employeeId: ObjectId | null;
  employeeName: string;
  employeePosition: string;
  employeeDepartment: string;

  // ============================================
  // КАКОЙ ТЕСТ
  // ============================================
  testId: ObjectId;
  testTitle: string;

  // ============================================
  // РЕЗУЛЬТАТЫ
  // ============================================
  totalScore: number;
  scaleScores?: TestSessionScaleScoreType[];
  scaleInterpretations?: TestSessionScaleInterpretationType[];
  interpretation: TestSessionInterpretationType;

  // ============================================
  // ОТВЕТЫ НА ВОПРОСЫ
  // ============================================
  answers: TestSessionAnswerType[];

  // ============================================
  // МЕРОПРИЯТИЕ
  // ============================================
  eventName: string;
  eventDate: Date;
  eventPlace: string;

  // ============================================
  // МЕТАДАННЫЕ
  // ============================================
  sessionType: TestSessionTypeEnum;
  createdAt: Date;
  completedAt: Date;
  timeSpent?: number;
};

// ============================================
// СХЕМЫ ДЛЯ MONGODB
// ============================================

const testSessionScaleScoreSchema = new Schema<TestSessionScaleScoreType>({
  scaleId: { type: String, required: true },
  score: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  percentage: { type: Number, required: true },
});

const testSessionScaleInterpretationSchema =
  new Schema<TestSessionScaleInterpretationType>({
    scaleId: { type: String, required: true },
    interpretation: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      recommendations: { type: [String], default: [] },
    },
  });

const testSessionInterpretationSchema =
  new Schema<TestSessionInterpretationType>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    recommendations: { type: [String], default: [] },
  });

const testSessionAnswerSchema = new Schema<TestSessionAnswerType>({
  questionId: { type: String, required: true },
  questionText: { type: String, required: true },
  questionType: {
    type: String,
    enum: ['single', 'multiple'],
    required: true,
  },
  optionIds: { type: [String], required: true },
  optionTexts: { type: [String], required: true },
  score: { type: Number, required: true },
});

const testSessionSchema = new Schema<TestSessionType>(
  {
    // ============================================
    // КТО ПРОХОДИЛ
    // ============================================
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: false, // ← Может быть null для manual
      default: null,
    },
    employeeName: {
      type: String,
      required: [true, 'Employee name should not be empty!'],
    },
    employeePosition: {
      type: String,
      required: false, // ← Может быть пустым для manual
      default: '',
    },
    employeeDepartment: {
      type: String,
      required: false, // ← Может быть пустым для manual
      default: '',
    },

    // ============================================
    // КАКОЙ ТЕСТ
    // ============================================
    testId: {
      type: Schema.Types.ObjectId,
      ref: 'Test',
      required: [true, 'Test ID should not be empty!'],
    },
    testTitle: {
      type: String,
      required: [true, 'Test title should not be empty!'],
    },

    // ============================================
    // РЕЗУЛЬТАТЫ
    // ============================================
    totalScore: {
      type: Number,
      required: [true, 'Total score should not be empty!'],
    },
    scaleScores: {
      type: [testSessionScaleScoreSchema],
      default: [],
    },
    scaleInterpretations: {
      type: [testSessionScaleInterpretationSchema],
      default: [],
    },
    interpretation: {
      type: testSessionInterpretationSchema,
      required: [true, 'Interpretation should not be empty!'],
    },

    // ============================================
    // ОТВЕТЫ НА ВОПРОСЫ
    // ============================================
    answers: {
      type: [testSessionAnswerSchema],
      required: [true, 'Answers should not be empty!'],
    },

    // ============================================
    // МЕРОПРИЯТИЕ
    // ============================================
    eventName: {
      type: String,
      required: [true, 'Event name should not be empty!'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date should not be empty!'],
    },
    eventPlace: {
      type: String,
      required: [true, 'Event place should not be empty!'],
    },

    // ============================================
    // МЕТАДАННЫЕ
    // ============================================
    sessionType: {
      type: String,
      enum: ['registered', 'manual'],
      required: true,
      default: 'registered',
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    timeSpent: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

// ============================================
// ИНДЕКСЫ ДЛЯ ПРОИЗВОДИТЕЛЬНОСТИ
// ============================================

// Индекс по сотруднику (для получения всех сессий сотрудника)
testSessionSchema.index({ employeeId: 1, completedAt: -1 });

// Индекс по тесту (для получения всех сессий по тесту)
testSessionSchema.index({ testId: 1, completedAt: -1 });

// Индекс по мероприятию (для получения всех сессий мероприятия)
testSessionSchema.index({ eventName: 1, eventDate: 1 });

// Индекс по дате завершения
testSessionSchema.index({ completedAt: -1 });

// Индекс по типу сессии (для фильтрации в админке)
testSessionSchema.index({ sessionType: 1, completedAt: -1 });

// ============================================
// ЭКСПОРТ
// ============================================

export const TestSession = model<TestSessionType>(
  'TestSession',
  testSessionSchema
);