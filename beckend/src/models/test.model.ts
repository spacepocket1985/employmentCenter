// Data Model Layer:
// Description: Defines the data structure for tests with multi-scale support.

import { Schema, model, ObjectId } from 'mongoose';

// Тип для варианта ответа
export type AnswerOptionType = {
  id: string;
  text: string;
  score: number;
};

// Тип для вопроса
export type QuestionType = {
  id: string;
  type: 'single' | 'multiple';
  text: string; // Текст вопроса с уже учтённым обращением
  options: AnswerOptionType[];
  order: number;
  required: boolean;
  isReversed: boolean; // Флаг обратного вопроса (для JSS и подобных)
  scale: string; // Название шкалы (для многошкальных тестов)
};

// Тип для шкалы
export type ScaleType = {
  id: string;
  name: string;
  description: string;
  questionIds: string[];
  minScore: number;
  maxScore: number;
};

// Тип для интерпретации результата
export type ResultInterpretationType = {
  id: string;
  scaleId?: string;
  rangeMin: number;
  rangeMax: number;
  title: string;
  description: string;
  recommendations?: string[];
};

// Основная модель теста
export type TestType = {
  _id: ObjectId;
  title: string;
  description: string;
  shortDescription?: string;
  category: string | string[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  estimatedTime?: number;
  questions: QuestionType[];
  scales?: ScaleType[]; // Опционально, для многошкальных тестов
  scoringMethod: 'sum' | 'average' | 'scale_based';
  interpretations: ResultInterpretationType[];
  showProgress: boolean;
  showScore: boolean;
  randomizeQuestions?: boolean;
  randomizeOptions?: boolean;
  showCorrectAnswers?: boolean;
  requireAllQuestions: boolean;
};

// Схемы для MongoDB
const answerOptionSchema = new Schema<AnswerOptionType>({
  id: { type: String, required: true },
  text: { type: String, required: true },
  score: { type: Number, required: true },
});

const questionSchema = new Schema<QuestionType>({
  id: { type: String, required: true },
  type: { type: String, enum: ['single', 'multiple'], required: true },
  text: { type: String, required: true },
  options: { type: [answerOptionSchema], required: true },
  order: { type: Number, required: true },
  required: { type: Boolean, required: true, default: true },
  isReversed: { type: Boolean, required: true, default: false },
  scale: { type: String, required: true },
});

const scaleSchema = new Schema<ScaleType>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  questionIds: { type: [String], required: true },
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
});

const resultInterpretationSchema = new Schema<ResultInterpretationType>({
  id: { type: String, required: true },
  scaleId: { type: String, required: false },
  rangeMin: { type: Number, required: true },
  rangeMax: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  recommendations: { type: [String], default: [] },
});

const testSchema = new Schema<TestType>(
  {
    title: {
      type: String,
      required: [true, 'Title should not be empty!'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description should not be empty!'],
    },
    shortDescription: {
      type: String,
      required: false,
    },
    category: {
      type: Schema.Types.Mixed,
      required: [true, 'Category should not be empty!'],
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    estimatedTime: {
      type: Number,
      required: false,
    },
    questions: {
      type: [questionSchema],
      required: [true, 'Questions should not be empty!'],
      validate: {
        validator: (questions: QuestionType[]) => questions.length >= 1,
        message: 'At least one question is required!',
      },
    },
    scales: {
      type: [scaleSchema],
      required: false,
    },
    scoringMethod: {
      type: String,
      enum: ['sum', 'average', 'scale_based'],
      required: [true, 'Scoring method should not be empty!'],
      default: 'sum',
    },
    interpretations: {
      type: [resultInterpretationSchema],
      required: [true, 'Interpretations should not be empty!'],
    },
    showProgress: {
      type: Boolean,
      required: true,
      default: true,
    },
    showScore: {
      type: Boolean,
      required: true,
      default: true,
    },
    randomizeQuestions: {
      type: Boolean,
      required: false,
      default: false,
    },
    requireAllQuestions: {
      type: Boolean,
      required: true,
      default: true,
    },
    randomizeOptions: {
      type: Boolean,
      required: false,
      default: false,
    },
    showCorrectAnswers: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true }
);

// Индексы для производительности
testSchema.index({ isActive: 1, category: 1 });
testSchema.index({ title: 'text' });

export const Test = model<TestType>('Test', testSchema);