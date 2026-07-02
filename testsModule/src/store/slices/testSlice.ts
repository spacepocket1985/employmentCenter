// Описание: Слайс для управления состоянием тестов
// Содержит reducer, actions и селекторы

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  TestType, 
  TestResultType,
  TestAnswerModel,
  QuestionType,
} from 'src/types/tests.types';
// Импортируем тип из store.ts
import type { AppRootState } from '@store/store';

// ============================================
// ТИПЫ СОСТОЯНИЯ
// ============================================

/**
 * Возможные состояния страницы
 */
export type TestPageState = 'idle' | 'testing' | 'result';

/**
 * Состояние всего приложения (тесты)
 */
export type TestState = {
  /** Текущая страница */
  pageState: TestPageState;
  
  /** Список всех тестов */
  tests: TestType[];
  
  /** Текущий выбранный тест */
  currentTest: TestType | null;
  
  /** Индекс текущего вопроса (0-based) */
  currentQuestionIndex: number;
  
  /** Ответы пользователя */
  answers: TestAnswerModel[];
  
  /** Результат теста (после отправки) */
  result: TestResultType | null;
  
  /** Флаг отправки результатов */
  isSubmitting: boolean;
  
  /** Ошибка (если есть) */
  error: string | null;
};

// ============================================
// НАЧАЛЬНОЕ СОСТОЯНИЕ
// ============================================

const initialState: TestState = {
  pageState: 'idle',
  tests: [],
  currentTest: null,
  currentQuestionIndex: 0,
  answers: [],
  result: null,
  isSubmitting: false,
  error: null,
};

// ============================================
// SLICE
// ============================================

/**
 * Слайс для управления состоянием тестов
 */
const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    /**
     * Установка списка тестов
     */
    setTests: (state: TestState, action: PayloadAction<TestType[]>): void => {
      state.tests = action.payload;
      state.error = null;
    },

    /**
     * Начало прохождения теста
     */
    startTest: (state: TestState, action: PayloadAction<TestType>): void => {
      state.pageState = 'testing';
      state.currentTest = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.result = null;
      state.error = null;
      state.isSubmitting = false;
    },

    /**
     * Сохранение ответа на вопрос
     */
    setAnswer: (state: TestState, action: PayloadAction<TestAnswerModel>): void => {
      const { questionId, optionIds }: TestAnswerModel = action.payload;
      
      // Ищем существующий ответ
      const existingIndex: number = state.answers.findIndex(
        (answer: TestAnswerModel): boolean => answer.questionId === questionId
      );

      if (existingIndex >= 0) {
        // Обновляем существующий ответ
        state.answers[existingIndex] = { questionId, optionIds };
      } else {
        // Добавляем новый ответ
        state.answers.push({ questionId, optionIds });
      }
      
      state.error = null;
    },

    /**
     * Переход к следующему вопросу
     */
    nextQuestion: (state: TestState): void => {
      if (!state.currentTest) return;
      
      const nextIndex: number = state.currentQuestionIndex + 1;
      const isLast: boolean = nextIndex >= state.currentTest.questions.length;
      
      if (isLast) return;
      
      state.currentQuestionIndex = nextIndex;
      state.error = null;
    },

    /**
     * Переход к предыдущему вопросу
     */
    prevQuestion: (state: TestState): void => {
      const prevIndex: number = state.currentQuestionIndex - 1;
      if (prevIndex < 0) return;
      
      state.currentQuestionIndex = prevIndex;
      state.error = null;
    },

    /**
     * Установка результата теста
     */
    setResult: (state: TestState, action: PayloadAction<TestResultType>): void => {
      state.pageState = 'result';
      state.result = action.payload;
      state.isSubmitting = false;
      state.error = null;
    },

    /**
     * Начало отправки результатов
     */
    submitStart: (state: TestState): void => {
      state.isSubmitting = true;
      state.error = null;
    },

    /**
     * Конец отправки результатов
     */
    submitEnd: (state: TestState): void => {
      state.isSubmitting = false;
    },

    /**
     * Установка ошибки
     */
    setError: (state: TestState, action: PayloadAction<string>): void => {
      state.error = action.payload;
      state.isSubmitting = false;
    },

    /**
     * Очистка ошибки
     */
    clearError: (state: TestState): void => {
      state.error = null;
    },

    /**
     * Сброс состояния (возврат к списку)
     */
    reset: (state: TestState): void => {
      // Сохраняем список тестов
      const tests: TestType[] = state.tests;
      
      // Возвращаем начальное состояние, но сохраняем тесты
      Object.assign(state, {
        ...initialState,
        tests,
      });
    },

    /**
     * Переход к списку тестов (без сброса ответов)
     */
    goToList: (state: TestState): void => {
      state.pageState = 'idle';
    },
  },
});

// ============================================
// ЭКСПОРТ ACTIONS
// ============================================

export const {
  setTests,
  startTest,
  setAnswer,
  nextQuestion,
  prevQuestion,
  setResult,
  submitStart,
  submitEnd,
  setError,
  clearError,
  reset,
  goToList,
} = testSlice.actions;

// ============================================
// ЭКСПОРТ REDUCER
// ============================================

export default testSlice.reducer;

// ============================================
// СЕЛЕКТОРЫ
// ============================================

/**
 * Получение текущего вопроса
 */
export const selectCurrentQuestion = (state: AppRootState): QuestionType | null => {
  const { currentTest, currentQuestionIndex }: TestState = state.test;
  if (!currentTest) return null;
  return currentTest.questions[currentQuestionIndex] || null;
};

/**
 * Получение прогресса прохождения (0-100)
 */
export const selectProgress = (state: AppRootState): number => {
  const { currentTest, currentQuestionIndex }: TestState = state.test;
  if (!currentTest || currentTest.questions.length === 0) return 0;
  
  return Math.round(
    ((currentQuestionIndex + 1) / currentTest.questions.length) * 100
  );
};

/**
 * Проверка, является ли текущий вопрос последним
 */
export const selectIsLastQuestion = (state: AppRootState): boolean => {
  const { currentTest, currentQuestionIndex }: TestState = state.test;
  if (!currentTest) return false;
  return currentQuestionIndex === currentTest.questions.length - 1;
};

/**
 * Проверка, является ли текущий вопрос первым
 */
export const selectIsFirstQuestion = (state: AppRootState): boolean => {
  return state.test.currentQuestionIndex === 0;
};

/**
 * Получение количества отвеченных вопросов
 */
export const selectAnsweredCount = (state: AppRootState): number => {
  return state.test.answers.length;
};

/**
 * Проверка, отвечены ли все вопросы
 */
export const selectIsAllAnswered = (state: AppRootState): boolean => {
  const { currentTest, answers }: TestState = state.test;
  if (!currentTest) return false;
  
  // Проверяем только обязательные вопросы
  const requiredQuestions: QuestionType[] = currentTest.questions.filter(
    (q: QuestionType): boolean => q.required
  );
  const answeredQuestionIds: string[] = answers.map(
    (a: TestAnswerModel): string => a.questionId
  );
  
  return requiredQuestions.every(
    (q: QuestionType): boolean => answeredQuestionIds.includes(q.id)
  );
};

/**
 * Получение ответа на конкретный вопрос
 */
export const selectAnswerByQuestionId = (
  state: AppRootState, 
  questionId: string
): TestAnswerModel | undefined => {
  return state.test.answers.find(
    (a: TestAnswerModel): boolean => a.questionId === questionId
  );
};

/**
 * Получение всех ответов пользователя
 */
export const selectAnswers = (state: AppRootState): TestAnswerModel[] => {
  return state.test.answers;
};

/**
 * Проверка, есть ли тест в процессе прохождения
 */
export const selectIsTesting = (state: AppRootState): boolean => {
  return state.test.pageState === 'testing';
};

/**
 * Проверка, находится ли пользователь на странице результата
 */
export const selectIsResult = (state: AppRootState): boolean => {
  return state.test.pageState === 'result';
};

/**
 * Проверка, находится ли пользователь на странице списка
 */
export const selectIsIdle = (state: AppRootState): boolean => {
  return state.test.pageState === 'idle';
};

/**
 * Получение общего количества вопросов
 */
export const selectTotalQuestions = (state: AppRootState): number => {
  const { currentTest }: TestState = state.test;
  if (!currentTest) return 0;
  return currentTest.questions.length;
};

/**
 * Получение текущего индекса вопроса
 */
export const selectCurrentQuestionIndex = (state: AppRootState): number => {
  return state.test.currentQuestionIndex;
};

/**
 * Получение текущего теста
 */
export const selectCurrentTest = (state: AppRootState): TestType | null => {
  return state.test.currentTest;
};

/**
 * Получение всех тестов
 */
export const selectAllTests = (state: AppRootState): TestType[] => {
  return state.test.tests;
};

/**
 * Получение результата теста
 */
export const selectTestResult = (state: AppRootState): TestResultType | null => {
  return state.test.result;
};

/**
 * Проверка, идет ли отправка
 */
export const selectIsSubmitting = (state: AppRootState): boolean => {
  return state.test.isSubmitting;
};

/**
 * Получение ошибки
 */
export const selectError = (state: AppRootState): string | null => {
  return state.test.error;
};