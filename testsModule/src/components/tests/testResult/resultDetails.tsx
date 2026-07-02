// Описание: Компонент для отображения деталей по шкалам
// Показывает баллы по каждой шкале в виде прогресс-баров

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Stack,
} from '@mui/material';
import type { ScaleScoreType } from 'src/types/tests.types';
import { translateScale } from '@utils/scaleTranslations';

/**
 * Props для ResultDetails
 */
type ResultDetailsProps = {
  /** Массив результатов по шкалам */
  scaleScores: ScaleScoreType[];
};

/**
 * Компонент для отображения деталей по шкалам
 */
export const ResultDetails: React.FC<ResultDetailsProps> = ({
  scaleScores,
}: ResultDetailsProps): React.ReactElement | null => {
  // Если нет данных по шкалам, ничего не показываем
  if (!scaleScores || scaleScores.length === 0) {
    return null;
  }

  // Определяем цвет для процента
  const getProgressColor = (percentage: number): string => {
    if (percentage < 33) return '#2e7d32'; // зелёный
    if (percentage < 66) return '#ed6c02'; // оранжевый
    return '#d32f2f'; // красный
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#103896' }}>
        Результаты по шкалам
      </Typography>

      <Stack spacing={3}>
        {scaleScores.map((scale: ScaleScoreType) => {
          const color = getProgressColor(scale.percentage);
          const translatedName = translateScale(scale.scaleId);

          return (
            <Box key={scale.scaleId}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  {translatedName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {scale.score} / {scale.maxScore} ({Math.round(scale.percentage)}%)
                </Typography>
              </Box>

              <LinearProgress
                variant="determinate"
                value={Math.min(scale.percentage, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(16, 56, 150, 0.12)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
};