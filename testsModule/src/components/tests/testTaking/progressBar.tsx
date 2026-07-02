// Описание: Компонент индикатора прогресса прохождения теста
// Показывает текущий вопрос, общее количество и процент выполнения

import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

/**
 * Props для ProgressBar
 */
type ProgressBarProps = {
  /** Текущий индекс вопроса (0-based) */
  currentIndex: number;
  /** Общее количество вопросов */
  totalQuestions: number;
  /** Количество отвеченных вопросов */
  answeredCount: number;
  /** Процент выполнения (0-100) */
  progress: number;
};

/**
 * Компонент индикатора прогресса
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  answeredCount,
  progress,
}: ProgressBarProps): React.ReactElement => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 1,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Вопрос {currentIndex + 1} из {totalQuestions}
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Отвечено: {answeredCount} из {totalQuestions}
        </Typography>
      </Box>
      
      <LinearProgress 
        variant="determinate" 
        value={progress}
        sx={{
          height: 8,
          borderRadius: 4,
          backgroundColor: 'rgba(16, 56, 150, 0.12)',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#103896',
            borderRadius: 4,
          },
        }}
      />
      
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ 
          display: 'block',
          mt: 0.5,
          textAlign: 'right',
        }}
      >
        {progress}% выполнено
      </Typography>
    </Box>
  );
};