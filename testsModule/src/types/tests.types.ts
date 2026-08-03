// Описание: Типы для работы с тестами
// Содержит все необходимые типы для фронтенда

// ============================================
// СУЩЕСТВУЮЩИЕ ТИПЫ
// ============================================

export type DayType =
  | 'working'
  | 'weekend'
  | 'holiday'
  | 'monday_thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

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
  text: string;
  options: AnswerOptionType[];
  order: number;
  required: boolean;
  isReversed: boolean;
  scale: string;
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
  rangeMin: number;
  rangeMax: number;
  title: string;
  description: string;
  recommendations?: string[];
};

// Основная модель теста
export type TestType = {
  _id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: string | string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  estimatedTime?: number;
  questions: QuestionType[];
  scales?: ScaleType[];
  scoringMethod: 'sum' | 'average' | 'scale_based';
  interpretations: ResultInterpretationType[];
  showProgress: boolean;
  showScore: boolean;
  randomizeQuestions?: boolean;
  requireAllQuestions: boolean;
};

// ============================================
// НОВЫЕ ТИПЫ
// ============================================

/**
 * Результат по одной шкале
 * Используется для многошкальных тестов (JSS, JAS)
 */
export type ScaleScoreType = {
  scaleId: string;
  score: number;
  maxScore: number;
  percentage: number;
};

/**
 * Результат по одному вопросу
 * Используется для детализации
 */
export type QuestionScoreType = {
  questionId: string;
  score: number;
  text: string;
};

/**
 * Полный результат теста
 * Возвращается с бэкенда после отправки ответов
 */
export type TestResultType = {
  /** Общий балл по тесту */
  totalScore: number;

  /** Результаты по шкалам (если есть) */
  scaleScores?: ScaleScoreType[];

  /** Интерпретация результата */
  interpretation: ResultInterpretationType;

  /** Результаты по каждому вопросу (для детализации) */
  questionScores?: QuestionScoreType[];
};

// ============================================
// ТИПЫ ДЛЯ ОТПРАВКИ НА БЭКЕНД
// ============================================

/**
 * Тип для создания маршрута (DTO)
 */
export type CreateBusRouteDTO = {
  routeNumber: string;
  routeName?: string;
  description?: string | null;
  schedules: {
    period: 'morning' | 'evening';
    dayTypes: DayType[];
    vehicles: { model: string; capacity?: number }[];
    busStops: {
      orderNumber: number;
      name: string;
      address: string;
      isSpecialNote?: boolean;
    }[];
    notes?: string;
  }[];
  isActive?: boolean;
};

/**
 * Тип для обновления маршрута
 */
export type UpdateBusRouteDTO = Partial<CreateBusRouteDTO>;

// ============================================
// ТИПЫ ДЛЯ ОТВЕТА ОТ БЭКЕНДА
// ============================================

/**
 * Ответ API для одного маршрута
 */
export type TestApiResponse = {
  data: TestType;
  msg: string;
};

/**
 * Ответ API для списка маршрутов
 */
export type TestsApiResponse = {
  data: TestType[];
  msg: string;
};

/**
 * Ответ API для результата теста
 */
export type TestResultApiResponse = {
  data: TestResultType;
  msg: string;
};

// ============================================
// ТИПЫ ДЛЯ ОТПРАВКИ ОТВЕТОВ
// ============================================

/**
 * Ответ пользователя на вопрос (для отправки)
 */
export type TestAnswerModel = {
  questionId: string;
  optionIds: string[];
};

/**
 * Модель отправки результатов теста
 */
export type TestSubmissionModel = {
  testId: string;
  answers: TestAnswerModel[];
  timeSpent?: number;
};

// ============================================
// ТИПЫ ДЛЯ UI
// ============================================

/**
 * Состояние снекбара
 */
export type SnackbarState = {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
};

export type QuestionReviewType = {
  /** ID вопроса */
  questionId: string;
  /** Текст вопроса */
  questionText: string;
  /** Ответ пользователя */
  userAnswer: string;
  /** Правильный ответ */
  correctAnswer: string;
  /** Правильно ли ответил пользователь */
  isCorrect: boolean;
  /** Пояснение (опционально) */
  explanation?: string;
};

/**
 * Расширенный результат теста с разбором ответов
 */
export type ExtendedTestResultType = TestResultType & {
  /** Детальный разбор по каждому вопросу */
  questionReviews?: QuestionReviewType[];
};
