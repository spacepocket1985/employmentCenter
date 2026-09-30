// Описание: Слайс для управления состоянием тестов
// Содержит reducer, actions, селекторы и async thunk

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  TestType,
  TestResultType,
  TestAnswerModel,
  QuestionType,
} from 'src/types/tests.types';
import { fetchTestById } from '@api/testsApi';
import type { AppRootState } from '@store/store';
import type { EmployeeType } from 'src/types/employee.types';

// ============================================
// ТИПЫ СОСТОЯНИЯ
// ============================================

/**
 * Возможные состояния страницы
 */
export type TestPageState = 'idle' | 'testing' | 'result';

/**
 * Режим выбора сотрудника
 * - list: выбор из списка мастеров
 * - manual: ручной ввод ФИО
 * - anonymous: анонимное прохождение (тренировка)
 */
export type EmployeeSelectionMode = 'list' | 'manual' | 'anonymous';

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

  /** Флаг загрузки теста */
  isLoading: boolean;

  /** Ошибка (если есть) */
  error: string | null;

  // ============================================
  // ВЫБОР СОТРУДНИКА
  // ============================================

  /** Выбранный сотрудник (для именных тестов) */
  selectedEmployee: EmployeeType | null;

  /** Режим выбора сотрудника */
  employeeSelectionMode: EmployeeSelectionMode;

  /** ФИО, введённое вручную */
  manualEmployeeName: string;
  isEmployeeConfirmed: boolean; // ← НОВОЕ
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
  isLoading: false,
  error: null,
  selectedEmployee: null,
  employeeSelectionMode: 'list',
  manualEmployeeName: '',
  isEmployeeConfirmed: false,
};

// ============================================
// АСИНХРОННЫЙ THUNK ДЛЯ ЗАГРУЗКИ ТЕСТА
// ============================================

/**
 * Загрузка теста по ID с перемешиванием вопросов и ответов
 * @param testId - ID теста
 * @param shuffleOptions - перемешивать ли вопросы и ответы (по умолчанию true)
 */
export const fetchTestThunk = createAsyncThunk<
  TestType,
  { testId: string; shuffleOptions?: boolean },
  { rejectValue: string }
>(
  'test/fetchTest',
  async ({ testId, shuffleOptions = true }, { rejectWithValue }) => {
    try {
      const response = await fetchTestById(testId, shuffleOptions);
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Не удалось загрузить тест';
      return rejectWithValue(errorMessage);
    }
  }
);

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
    // ============================================
    // ТЕСТЫ
    // ============================================

    /**
     * Установка списка тестов
     */
    setTests: (state: TestState, action: PayloadAction<TestType[]>): void => {
      state.tests = action.payload;
      state.error = null;
    },

    /**
     * Начало прохождения теста (синхронный вариант)
     */
    startTest: (state: TestState, action: PayloadAction<TestType>): void => {
      state.pageState = 'testing';
      state.currentTest = action.payload;
      state.currentQuestionIndex = 0;
      state.answers = [];
      state.result = null;
      state.error = null;
      state.isSubmitting = false;
      state.isLoading = false;
      // Не сбрасываем selectedEmployee — он может быть выбран заранее
    },

    // ============================================
    // ОТВЕТЫ НА ВОПРОСЫ
    // ============================================

    /**
     * Сохранение ответа на вопрос
     */
    setAnswer: (
      state: TestState,
      action: PayloadAction<TestAnswerModel>
    ): void => {
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
     * Установка текущего вопроса (для перехода по индексу)
     */
    setCurrentQuestionIndex: (
      state: TestState,
      action: PayloadAction<number>
    ): void => {
      const index: number = action.payload;
      if (
        state.currentTest &&
        index >= 0 &&
        index < state.currentTest.questions.length
      ) {
        state.currentQuestionIndex = index;
        state.error = null;
      }
    },

    /**
     * Очистка ответов (без сброса состояния)
     */
    clearAnswers: (state: TestState): void => {
      state.answers = [];
      state.currentQuestionIndex = 0;
    },

    // ============================================
    // РЕЗУЛЬТАТЫ
    // ============================================

    /**
     * Установка результата теста
     */
    setResult: (
      state: TestState,
      action: PayloadAction<TestResultType>
    ): void => {
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

    // ============================================
    // ОШИБКИ
    // ============================================

    /**
     * Установка ошибки
     */
    setError: (state: TestState, action: PayloadAction<string>): void => {
      state.error = action.payload;
      state.isSubmitting = false;
      state.isLoading = false;
    },

    /**
     * Очистка ошибки
     */
    clearError: (state: TestState): void => {
      state.error = null;
    },

    // ============================================
    // НАВИГАЦИЯ
    // ============================================

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

    // ============================================
    // СОТРУДНИК
    // ============================================

    /**
     * Установка выбранного сотрудника
     */
    setSelectedEmployee: (
      state: TestState,
      action: PayloadAction<EmployeeType>
    ): void => {
      state.selectedEmployee = action.payload;
      state.error = null;
    },

    /**
     * Очистка выбранного сотрудника
     */
    clearSelectedEmployee: (state: TestState): void => {
      state.selectedEmployee = null;
    },

    /**
     * Установка режима выбора сотрудника
     */
    setEmployeeSelectionMode: (
      state: TestState,
      action: PayloadAction<EmployeeSelectionMode>
    ): void => {
      state.employeeSelectionMode = action.payload;
      state.error = null;
    },

    /**
     * Установка ФИО для ручного ввода
     */
    setManualEmployeeName: (
      state: TestState,
      action: PayloadAction<string>
    ): void => {
      state.manualEmployeeName = action.payload;
      state.error = null;
    },

    confirmEmployeeSelection: (state: TestState): void => {
      state.isEmployeeConfirmed = true;
    },

    /**
     * Сброс выбора сотрудника (режим + данные)
     */

    resetEmployeeSelection: (state: TestState): void => {
      state.selectedEmployee = null;
      state.employeeSelectionMode = 'list';
      state.manualEmployeeName = '';
      state.isEmployeeConfirmed = false; // ← Сброс
    },
  },
  // ============================================
  // EXTRA REDUCERS (для async thunk)
  // ============================================
  extraReducers: (builder) => {
    builder
      // Загрузка теста началась
      .addCase(fetchTestThunk.pending, (state: TestState) => {
        state.isLoading = true;
        state.error = null;
      })
      // Загрузка теста успешна
      .addCase(
        fetchTestThunk.fulfilled,
        (state: TestState, action: PayloadAction<TestType>) => {
          state.isLoading = false;
          state.currentTest = action.payload;
          state.pageState = 'testing';
          state.currentQuestionIndex = 0;
          state.answers = [];
          state.result = null;
          state.error = null;
          state.isSubmitting = false;
        }
      )
      // Загрузка теста с ошибкой
      .addCase(fetchTestThunk.rejected, (state: TestState, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Не удалось загрузить тест';
        state.currentTest = null;
        state.pageState = 'idle';
      });
  },
});

// ============================================
// ЭКСПОРТ ACTIONS
// ============================================

export const {
  // Тесты
  setTests,
  startTest,
  // Ответы
  setAnswer,
  nextQuestion,
  prevQuestion,
  setCurrentQuestionIndex,
  clearAnswers,
  // Результаты
  setResult,
  submitStart,
  submitEnd,
  // Ошибки
  setError,
  clearError,
  // Навигация
  reset,
  goToList,
  // Сотрудник
  setSelectedEmployee,
  clearSelectedEmployee,
  setEmployeeSelectionMode,
  setManualEmployeeName,
  resetEmployeeSelection,
  confirmEmployeeSelection,
} = testSlice.actions;

// ============================================
// ЭКСПОРТ REDUCER
// ============================================

export default testSlice.reducer;

// ============================================
// СЕЛЕКТОРЫ
// ============================================

// --------------------------------------------
// ВОПРОСЫ
// --------------------------------------------

/**
 * Получение текущего вопроса
 */
export const selectCurrentQuestion = (
  state: AppRootState
): QuestionType | null => {
  const { currentTest, currentQuestionIndex }: TestState = state.test;
  if (!currentTest) return null;
  return currentTest.questions[currentQuestionIndex] || null;
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

// --------------------------------------------
// ОТВЕТЫ
// --------------------------------------------

/**
 * Получение всех ответов пользователя
 */
export const selectAnswers = (state: AppRootState): TestAnswerModel[] => {
  return state.test.answers;
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

  return requiredQuestions.every((q: QuestionType): boolean =>
    answeredQuestionIds.includes(q.id)
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

// --------------------------------------------
// СОСТОЯНИЕ СТРАНИЦЫ
// --------------------------------------------

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

// --------------------------------------------
// ТЕСТЫ
// --------------------------------------------

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
 * Получение тестов без коррупции
 */

export const selectTestsWithoutCoruption = (
  state: AppRootState
): TestType[] => {
  return state.test.tests.filter(
    (t) => t.category !== 'Антикоррупционное обучение'
  );
};

/**
 * Получение результата теста
 */
export const selectTestResult = (
  state: AppRootState
): TestResultType | null => {
  return state.test.result;
};

// --------------------------------------------
// ФЛАГИ
// --------------------------------------------

/**
 * Проверка, идет ли отправка
 */
export const selectIsSubmitting = (state: AppRootState): boolean => {
  return state.test.isSubmitting;
};

/**
 * Проверка, идет ли загрузка теста
 */
export const selectIsLoading = (state: AppRootState): boolean => {
  return state.test.isLoading;
};

/**
 * Получение ошибки
 */
export const selectError = (state: AppRootState): string | null => {
  return state.test.error;
};

// --------------------------------------------
// СОТРУДНИК
// --------------------------------------------

/**
 * Получение выбранного сотрудника
 */
export const selectSelectedEmployee = (
  state: AppRootState
): EmployeeType | null => {
  return state.test.selectedEmployee;
};

/**
 * Проверка, выбран ли сотрудник
 */
export const selectIsEmployeeSelected = (state: AppRootState): boolean => {
  return state.test.selectedEmployee !== null;
};

/**
 * Получение режима выбора сотрудника
 */
export const selectEmployeeSelectionMode = (
  state: AppRootState
): EmployeeSelectionMode => {
  return state.test.employeeSelectionMode;
};

/**
 * Получение ФИО для ручного ввода
 */
export const selectManualEmployeeName = (state: AppRootState): string => {
  return state.test.manualEmployeeName;
};

/**
 * Проверка, можно ли начать тест (выбор сотрудника завершён)
 * - list: выбран сотрудник
 * - manual: введено ФИО
 * - anonymous: всегда true
 */
export const selectIsEmployeeSelectionComplete = (
  state: AppRootState
): boolean => {
  const { employeeSelectionMode, selectedEmployee, manualEmployeeName } =
    state.test;

  switch (employeeSelectionMode) {
    case 'list':
      return selectedEmployee !== null;
    case 'manual':
      return manualEmployeeName.trim().length > 0;
    case 'anonymous':
      return true;
    default:
      return false;
  }
};

export const selectIsEmployeeConfirmed = (state: AppRootState): boolean => {
  return state.test.isEmployeeConfirmed;
};
