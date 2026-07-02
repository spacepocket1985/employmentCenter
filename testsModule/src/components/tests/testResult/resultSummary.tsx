// Описание: Компонент для отображения общего результата
// Показывает общий балл, заголовок интерпретации и описание

import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { ResultInterpretationType } from 'src/types/tests.types';

/**
 * Props для ResultSummary
 */
type ResultSummaryProps = {
  /** Общий балл */
  totalScore: number;
  /** Максимальный возможный балл (опционально) */
  maxScore?: number;
  /** Интерпретация результата */
  interpretation: ResultInterpretationType;
};

/**
 * Компонент для отображения общего результата
 */
export const ResultSummary: React.FC<ResultSummaryProps> = ({
  totalScore,
  maxScore,
  interpretation,
}: ResultSummaryProps): React.ReactElement => {
  // Определяем цвет в зависимости от уровня
  const getScoreColor = (): string => {
    const range = interpretation.rangeMax - interpretation.rangeMin;
    const percentage = (totalScore - interpretation.rangeMin) / range;
    
    if (percentage < 0.33) return '#2e7d32'; // зелёный
    if (percentage < 0.66) return '#ed6c02'; // оранжевый
    return '#d32f2f'; // красный
  };

  const scoreColor = getScoreColor();

  // Форматируем отображение балла
  const displayScore = totalScore.toString();
  const displayMax = maxScore ? `/ ${maxScore}` : '';

  return (
    <Paper
      elevation={2}
      sx={{
        p: 4,
        mb: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9edf5 100%)',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Ваш результат
      </Typography>

      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 140,
          height: 140,
          borderRadius: '50%',
          backgroundColor: '#103896',
          color: 'white',
          my: 2,
          p: 2,
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700,
              fontSize: {
                xs: '2rem',    // мобильные устройства
                sm: '2.5rem',  // планшеты
                md: '3rem',    // десктоп
              },
              lineHeight: 1,
            }}
          >
            {displayScore}
          </Typography>
          {maxScore && (
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.8,
                fontSize: {
                  xs: '0.9rem',
                  sm: '1rem',
                  md: '1.2rem',
                },
              }}
            >
              {displayMax}
            </Typography>
          )}
        </Box>
      </Box>

      <Typography
        variant="h5"
        sx={{
          color: scoreColor,
          fontWeight: 600,
          mb: 1,
        }}
      >
        {interpretation.title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
        {interpretation.description}
      </Typography>
    </Paper>
  );
};