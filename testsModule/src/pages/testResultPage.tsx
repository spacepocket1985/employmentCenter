// Описание: Страница с результатом теста
// Показывает полную информацию о результате

import React from 'react';
import { Box, Container, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import {
  selectTestResult,
  selectCurrentTest,
  reset,
} from '@store/slices/testSlice';
import {
  ResultSummary,
  ResultDetails,
  ResultRecommendations,
  AnswerReview,
} from '@components/tests';
import { TestHeader } from '@components/tests';
import type {
  TestResultType,
  ExtendedTestResultType,
} from 'src/types/tests.types';

/**
 * Проверка, является ли результат расширенным (с разбором ответов или интерпретациями по шкалам)
 */
function isExtendedResult(
  result: TestResultType
): result is ExtendedTestResultType {
  return 'questionReviews' in result || 'scaleInterpretations' in result;
}

/**
 * Страница с результатом теста
 */
export const TestResultPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Получаем данные из store
  const result: TestResultType | null = useAppSelector(selectTestResult);
  const currentTest = useAppSelector(selectCurrentTest);

  const handleReset = (): void => {
    dispatch(reset());
  };

  // Если нет результата, показываем сообщение
  if (!result) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Результат не найден
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Пройдите тест, чтобы увидеть результат
          </Typography>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{
              backgroundColor: '#103896',
              '&:hover': {
                backgroundColor: '#0d2d7a',
              },
            }}
          >
            Вернуться к списку
          </Button>
        </Box>
      </Container>
    );
  }

  // Вычисляем максимальный балл (если есть шкалы)
  const maxScore = result.scaleScores?.reduce(
    (sum: number, scale: { maxScore: number }): number => sum + scale.maxScore,
    0
  );

  // Проверяем, есть ли расширенные поля
  const extended = isExtendedResult(result)
    ? (result as ExtendedTestResultType)
    : null;

  // Проверяем, есть ли разбор ответов (для обучающих тестов)
  const hasQuestionReviews =
    extended?.questionReviews && extended.questionReviews.length > 0;

  // Проверяем, есть ли интерпретации по шкалам (для DASS-21 и подобных)
  const hasScaleInterpretations =
    extended?.scaleInterpretations && extended.scaleInterpretations.length > 0;

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 2 }}>
        {/* Заголовок теста */}
        {currentTest && (
          <Box sx={{ mb: 3 }}>
            <TestHeader
              title={currentTest.title}
              category={currentTest.category}
            />
          </Box>
        )}

        {/* ============================================ */}
        {/* ОБЩИЙ РЕЗУЛЬТАТ */}
        {/* ============================================ */}
        {/* Для DASS-21 скрываем интерпретацию в общем результате, */}
        {/* так как она показывается отдельно для каждой шкалы */}
        <ResultSummary
          totalScore={result.totalScore}
          maxScore={maxScore}
          interpretation={result.interpretation}
          hideInterpretation={hasScaleInterpretations}
          subtitle={
            hasScaleInterpretations
              ? 'Суммарный балл по всем шкалам. Детальная расшифровка представлена ниже.'
              : undefined
          }
        />

        {/* ============================================ */}
        {/* ДЕТАЛИ ПО ШКАЛАМ (единый компонент) */}
        {/* ============================================ */}
        {/* ResultDetails сам определяет, показывать интерпретации или нет */}
        {result.scaleScores && result.scaleScores.length > 0 && (
          <ResultDetails
            scaleScores={result.scaleScores}
            scaleInterpretations={extended?.scaleInterpretations}
          />
        )}

        {/* ============================================ */}
        {/* РАЗБОР ОТВЕТОВ (для обучающих тестов) */}
        {/* ============================================ */}
        {hasQuestionReviews && extended?.questionReviews && (
          <AnswerReview
            reviews={extended.questionReviews}
            title="Разбор ответов"
          />
        )}

        {/* ============================================ */}
        {/* ОБЩИЕ РЕКОМЕНДАЦИИ */}
        {/* ============================================ */}
        {/* Показываем только если нет интерпретаций по шкалам, */}
        {/* иначе рекомендации уже показаны в ResultDetails */}
        {!hasScaleInterpretations &&
          result.interpretation.recommendations &&
          result.interpretation.recommendations.length > 0 && (
            <ResultRecommendations
              recommendations={result.interpretation.recommendations}
              title="Рекомендации"
            />
          )}

        {/* Кнопка возврата */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleReset}
            sx={{
              backgroundColor: '#103896',
              '&:hover': {
                backgroundColor: '#0d2d7a',
              },
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Пройти другой тест
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
