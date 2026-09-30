// Описание: Страница прохождения теста
// Показывает вопросы, управляет ответами и отправляет результаты

import React, { useState } from 'react';
import { Box, Paper, Alert, Container } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import {
  selectCurrentTest,
  selectCurrentQuestionIndex,
  selectTotalQuestions,
  selectIsAllAnswered,
  selectProgress,
  selectAnswers,
  selectIsLastQuestion,
  selectIsFirstQuestion,
  selectSelectedEmployee,
  selectEmployeeSelectionMode,
  selectManualEmployeeName,
  nextQuestion,
  prevQuestion,
  setAnswer,
  selectIsEmployeeConfirmed,
} from '@store/slices/testSlice';
import { useSubmitTest } from '@hooks/useSubmitTest';
import {
  TestHeader,
  ProgressBar,
  QuestionRenderer,
  NavigationButtons,
  EmployeeSelector,
} from '@components/tests';
import type { TestAnswerModel } from 'src/types/tests.types';

/**
 * Страница прохождения теста
 */
export const TestTakingPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { submit, isSubmitting, error: submitError } = useSubmitTest();

  const [startTime] = useState<number>(Date.now());
  const [localError, setLocalError] = useState<string | null>(null);

  // ============================================
  // ДАННЫЕ ИЗ STORE
  // ============================================

  const currentTest = useAppSelector(selectCurrentTest);
  const currentIndex: number = useAppSelector(selectCurrentQuestionIndex);
  const totalQuestions: number = useAppSelector(selectTotalQuestions);
  const isAllAnswered: boolean = useAppSelector(selectIsAllAnswered);
  const progress: number = useAppSelector(selectProgress);
  const answers: TestAnswerModel[] = useAppSelector(selectAnswers);
  const isLastQuestion: boolean = useAppSelector(selectIsLastQuestion);
  const isFirstQuestion: boolean = useAppSelector(selectIsFirstQuestion);

  // Данные о сотруднике
  const selectedEmployee = useAppSelector(selectSelectedEmployee);
  const employeeSelectionMode = useAppSelector(selectEmployeeSelectionMode);
  const manualEmployeeName = useAppSelector(selectManualEmployeeName);
  const isEmployeeConfirmed: boolean = useAppSelector(
    selectIsEmployeeConfirmed
  );

  // ============================================
  // ПРОВЕРКА: НУЖЕН ЛИ ВЫБОР СОТРУДНИКА
  // ============================================

  /**
   * Нужно ли показывать экран выбора сотрудника:
   * - Тест требует идентификации
   * - Выбор сотрудника ещё не завершён
   */
  const needsEmployeeSelection: boolean =
    (currentTest?.requiresIdentification ?? false) && !isEmployeeConfirmed;
  // ============================================
  // ОБРАБОТЧИКИ
  // ============================================

  /**
   * Обработчик начала теста после выбора сотрудника
   */
  const handleStartAfterSelection = (): void => {
    // Выбор уже сохранён в Redux через EmployeeSelector
    // Здесь просто ничего не делаем — компонент перерендерится
    console.log('✅ Сотрудник выбран, начинаем тест');
  };

  const handleNext = (): void => {
    dispatch(nextQuestion());
  };

  const handlePrev = (): void => {
    dispatch(prevQuestion());
  };

  const handleAnswer = (optionIds: string[]): void => {
    if (!currentQuestion) return;
    dispatch(
      setAnswer({
        questionId: currentQuestion.id,
        optionIds,
      })
    );
  };

  /**
   * Отправка результатов теста
   */
  const handleSubmit = async (): Promise<void> => {
    if (!currentTest) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    setLocalError(null);

    // ============================================
    // ФОРМИРОВАНИЕ ДАННЫХ ДЛЯ ОТПРАВКИ
    // ============================================

    const submissionData = {
      testId: currentTest._id,
      answers: answers,
      timeSpent: timeSpent,

      // Данные сотрудника
      employeeId: selectedEmployee?._id || null,
      employeeName:
        employeeSelectionMode === 'manual'
          ? manualEmployeeName
          : selectedEmployee?.name || undefined,
      employeePosition: selectedEmployee?.job || undefined,
      employeeDepartment: selectedEmployee?.department || undefined,

      // Мероприятие
      eventName: currentTest.eventName || undefined,
      eventDate: currentTest.eventDate || undefined,
      eventPlace: currentTest.eventPlace || undefined,

      // Флаг логирования
      shouldLog: employeeSelectionMode !== 'anonymous',
    };

    console.log('🔍 Отправка данных:', {
      ...submissionData,
      answersCount: submissionData.answers.length,
    });

    const result = await submit(submissionData);

    if (!result) {
      setLocalError('Не удалось отправить результаты');
    }
  };

  // ============================================
  // ПОЛУЧЕНИЕ ТЕКУЩЕГО ВОПРОСА
  // ============================================

  const currentQuestion = currentTest?.questions[currentIndex];

  const selectedOptionIds: string[] =
    answers.find(
      (a: TestAnswerModel): boolean => a.questionId === currentQuestion?.id
    )?.optionIds || [];

  const hasCurrentAnswer: boolean = selectedOptionIds.length > 0;

  // ============================================
  // РЕНДЕР: ЕСЛИ НЕТ ТЕСТА
  // ============================================

  if (!currentTest) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Тест не найден
          </Alert>
        </Box>
      </Container>
    );
  }

  // ============================================
  // РЕНДЕР: ВЫБОР СОТРУДНИКА (если нужен)
  // ============================================

  if (needsEmployeeSelection) {
    return (
      <Container maxWidth="md">
        <Box sx={{ p: 2 }}>
          <EmployeeSelector onStart={handleStartAfterSelection} />
        </Box>
      </Container>
    );
  }

  // ============================================
  // РЕНДЕР: ОСНОВНОЙ ЭКРАН ТЕСТА
  // ============================================

  if (!currentQuestion) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Вопрос не найден
          </Alert>
        </Box>
      </Container>
    );
  }

  const displayError: string | null = submitError || localError;

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
          }}
        >
          {/* Заголовок теста */}
          <Box sx={{ mb: 3 }}>
            <TestHeader
              title={currentTest.title}
              category={currentTest.category}
            />
          </Box>

          {/* Информация о сотруднике (если выбран) */}
          {selectedEmployee && employeeSelectionMode === 'list' && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Сотрудник: <strong>{selectedEmployee.name}</strong> —{' '}
              {selectedEmployee.job} ({selectedEmployee.department})
            </Alert>
          )}

          {employeeSelectionMode === 'manual' && manualEmployeeName && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Сотрудник: <strong>{manualEmployeeName}</strong>
            </Alert>
          )}

          {employeeSelectionMode === 'anonymous' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Режим тренировки — результат не будет сохранён
            </Alert>
          )}

          {/* Прогресс */}
          <ProgressBar
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            answeredCount={answers.length}
            progress={progress}
          />

          {/* Ошибка */}
          {displayError && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
              onClose={(): void => setLocalError(null)}
            >
              {displayError}
            </Alert>
          )}

          {/* Вопрос */}
          <Box sx={{ my: 3 }}>
            <QuestionRenderer
              question={currentQuestion}
              selectedIds={selectedOptionIds}
              onSelect={handleAnswer}
            />
          </Box>

          {/* Навигация */}
          <NavigationButtons
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            isAllAnswered={isAllAnswered}
            hasCurrentAnswer={hasCurrentAnswer}
            onBack={handlePrev}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isLastQuestion={isLastQuestion}
            isFirstQuestion={isFirstQuestion}
          />
        </Paper>
      </Box>
    </Container>
  );
};
