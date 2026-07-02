// Описание: Компонент кнопок навигации по вопросам
// Содержит кнопки "Назад", "Далее" и "Отправить"

import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Send as SendIcon,
} from '@mui/icons-material';

/**
 * Props для NavigationButtons
 */
type NavigationButtonsProps = {
  /** Индекс текущего вопроса */
  currentIndex: number;
  /** Общее количество вопросов */
  totalQuestions: number;
  /** Отвечены ли все вопросы */
  isAllAnswered: boolean;
  /** Есть ли ответ на текущий вопрос */
  hasCurrentAnswer: boolean;
  /** Обработчик перехода назад */
  onBack: () => void;
  /** Обработчик перехода вперёд */
  onNext: () => void;
  /** Обработчик отправки результатов */
  onSubmit: () => void;
  /** Флаг отправки */
  isSubmitting: boolean;
  /** Флаг, что это последний вопрос */
  isLastQuestion: boolean;
  /** Флаг, что это первый вопрос */
  isFirstQuestion: boolean;
};

/**
 * Компонент кнопок навигации
 */
export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentIndex,
  totalQuestions,
  isAllAnswered,
  hasCurrentAnswer,
  onBack,
  onNext,
  onSubmit,
  isSubmitting,
  isLastQuestion,
  isFirstQuestion,
}: NavigationButtonsProps): React.ReactElement => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        mt: 3,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <Button
        variant="outlined"
        onClick={onBack}
        disabled={isFirstQuestion || isSubmitting}
        startIcon={<ArrowBackIcon />}
        sx={{ 
          minWidth: 120,
          color: '#103896',
          borderColor: '#103896',
          '&:hover': {
            borderColor: '#103896',
            backgroundColor: 'rgba(16, 56, 150, 0.04)',
          },
          '&:disabled': {
            borderColor: 'rgba(16, 56, 150, 0.2)',
          },
        }}
      >
        Назад
      </Button>
      
      {!isLastQuestion ? (
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!hasCurrentAnswer || isSubmitting}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            minWidth: 120,
            backgroundColor: '#103896',
            '&:hover': {
              backgroundColor: '#0d2d7a',
            },
          }}
        >
          Далее
        </Button>
      ) : (
        <Button
          variant="contained"
          color="success"
          onClick={onSubmit}
          disabled={!isAllAnswered || isSubmitting}
          endIcon={<SendIcon />}
          sx={{ 
            minWidth: 140,
            backgroundColor: '#2e7d32',
            '&:hover': {
              backgroundColor: '#1b5e20',
            },
          }}
        >
          {isSubmitting ? 'Отправка...' : 'Отправить'}
        </Button>
      )}
      
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ ml: 'auto' }}
      >
        {isAllAnswered ? ' Все вопросы отвечены' : `${currentIndex + 1} из ${totalQuestions}`}
      </Typography>
    </Box>
  );
};