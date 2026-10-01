// Description: Defines the data structure for user answers and test submission.

// ============================================
// ОТВЕТЫ ПОЛЬЗОВАТЕЛЯ
// ============================================

/**
 * Ответ пользователя на один вопрос
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

  // ============================================
  // НОВЫЕ ПОЛЯ (для именных тестов)
  // ============================================

  /** ID сотрудника (если выбран из списка или найден по ФИО) */
  employeeId?: string | null;
  /** ФИО сотрудника (для ручного ввода) */
  employeeName?: string;
  /** Должность сотрудника (опционально) */
  employeePosition?: string;
  /** Подразделение сотрудника (опционально) */
  employeeDepartment?: string;

  // ============================================
  // МЕРОПРИЯТИЕ
  // ============================================

  /** Название мероприятия */
  eventName?: string;
  /** Дата мероприятия */
  eventDate?: string;
  /** Место проведения мероприятия */
  eventPlace?: string;

  // ============================================
  // НОВОЕ: Флаг логирования
  // ============================================

  /**
   * Логировать ли результат:
   * - true (по умолчанию): результат сохраняется в testsessions
   * - false: результат НЕ сохраняется (тренировка)
   */
  shouldLog?: boolean;
};

// ============================================
// РАЗБОР ОТВЕТОВ (для обучающих тестов)
// ============================================

/**
 * Детальный разбор ответа по одному вопросу
 */
export type QuestionReviewType = {
  questionId: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation?: string;
};
