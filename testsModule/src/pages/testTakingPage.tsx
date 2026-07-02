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
  reset,
  nextQuestion,
  prevQuestion,
  setAnswer,
} from '@store/slices/testSlice';
import { useSubmitTest } from '@hooks/useSubmitTest';
import {
  TestHeader,
  ProgressBar,
  QuestionRenderer,
  NavigationButtons,
} from '@components/tests';

import type { TestAnswerModel } from 'src/types/tests.types';

/**
 * Страница прохождения теста
 */
export const TestTakingPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const { submit, isSubmitting, error: submitError } = useSubmitTest();

  const [startTime] = useState<number>(Date.now());

  // Получаем данные из store
  const currentTest = useAppSelector(selectCurrentTest);
  const currentIndex: number = useAppSelector(selectCurrentQuestionIndex);
  const totalQuestions: number = useAppSelector(selectTotalQuestions);
  const isAllAnswered: boolean = useAppSelector(selectIsAllAnswered);
  const progress: number = useAppSelector(selectProgress);
  const answers: TestAnswerModel[] = useAppSelector(selectAnswers);
  const isLastQuestion: boolean = useAppSelector(selectIsLastQuestion);
  const isFirstQuestion: boolean = useAppSelector(selectIsFirstQuestion);

  // Локальное состояние для ошибок
  const [localError, setLocalError] = useState<string | null>(null);

  // Получаем текущий вопрос
  const currentQuestion = currentTest?.questions[currentIndex];

  // Получаем выбранные ответы для текущего вопроса
  const selectedOptionIds: string[] =
    answers.find(
      (a: TestAnswerModel): boolean => a.questionId === currentQuestion?.id
    )?.optionIds || [];

  // Есть ли ответ на текущий вопрос
  const hasCurrentAnswer: boolean = selectedOptionIds.length > 0;

  // Обработчики
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

  const handleSubmit = async (): Promise<void> => {
    if (!currentTest) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000); // в секундах

    setLocalError(null);

    const submissionData = {
      testId: currentTest._id,
      answers: answers,
      imeSpent: timeSpent,
    };

    const result = await submit(submissionData);

    if (!result) {
      setLocalError('Не удалось отправить результаты');
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleReset = (): void => {
    dispatch(reset());
  };

  // Если нет текущего теста
  if (!currentTest || !currentQuestion) {
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

  // Ошибка при отправке
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
