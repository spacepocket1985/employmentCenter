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
} from '@components/tests';
import { TestHeader } from '@components/tests';
import type { TestResultType } from 'src/types/tests.types';

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

        {/* Общий результат */}
        <ResultSummary
          totalScore={result.totalScore}
          maxScore={maxScore}
          interpretation={result.interpretation}
        />

        {/* Детали по шкалам (только они, без дублирования) */}
        {result.scaleScores && result.scaleScores.length > 0 && (
          <ResultDetails scaleScores={result.scaleScores} />
        )}

        {/* Рекомендации */}
        {result.interpretation.recommendations && 
         result.interpretation.recommendations.length > 0 && (
          <ResultRecommendations 
            recommendations={result.interpretation.recommendations} 
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