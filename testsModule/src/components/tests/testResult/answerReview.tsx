// Описание: Компонент для отображения разбора ответов (обучающий режим)
// Показывает правильные/неправильные ответы и объяснения
// Используется только для тестов с showCorrectAnswers: true

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import type { QuestionReviewType } from 'src/types/tests.types';

/**
 * Props для AnswerReview
 */
type AnswerReviewProps = {
  /** Массив с разбором ответов */
  reviews: QuestionReviewType[] | undefined;
  /** Заголовок блока */
  title?: string;
};

/**
 * Компонент для отображения разбора ответов
 */
export const AnswerReview: React.FC<AnswerReviewProps> = ({
  reviews,
  title = 'Разбор ответов',
}: AnswerReviewProps): React.ReactElement | null => {
  const [expanded, setExpanded] = useState<string | false>(false);

  // Если нет данных, ничего не показываем
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Разделяем на правильные и неправильные
  const correctAnswers = reviews.filter((r: QuestionReviewType) => r.isCorrect);
  const incorrectAnswers = reviews.filter((r: QuestionReviewType) => !r.isCorrect);

  const handleChange = (questionId: string) => (_event: React.SyntheticEvent, isExpanded: boolean): void => {
    setExpanded(isExpanded ? questionId : false);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Заголовок с количеством правильных/неправильных ответов */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ color: '#103896' }}>
          {title}
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
            label={`Правильных: ${correctAnswers.length}`}
            color="success"
            size="small"
          />
          <Chip
            icon={<CancelIcon sx={{ fontSize: 16 }} />}
            label={`Неправильных: ${incorrectAnswers.length}`}
            color="error"
            size="small"
          />
        </Stack>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Список вопросов с разбором */}
      {reviews.map((review: QuestionReviewType) => (
        <Accordion
          key={review.questionId}
          expanded={expanded === review.questionId}
          onChange={handleChange(review.questionId)}
          sx={{
            mb: 1,
            border: `1px solid ${review.isCorrect ? '#e8f5e9' : '#ffebee'}`,
            borderRadius: 1,
            '&:before': { display: 'none' },
            '&.Mui-expanded': {
              margin: 0,
              mb: 1,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: review.isCorrect ? '#e8f5e9' : '#ffebee',
              borderRadius: 1,
              '&.Mui-expanded': {
                borderRadius: '4px 4px 0 0',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              {review.isCorrect ? (
                <CheckCircleIcon sx={{ color: '#2e7d32' }} />
              ) : (
                <CancelIcon sx={{ color: '#c62828' }} />
              )}
              <Typography variant="body2" sx={{ flex: 1 }}>
                {review.isCorrect ? 'Верно' : 'Неверно'} — {review.questionText}
              </Typography>
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ p: 2 }}>
            {/* Ответ пользователя */}
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Ваш ответ:
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: review.isCorrect ? '#2e7d32' : '#c62828',
                  fontWeight: review.isCorrect ? 400 : 500,
                }}
              >
                {review.userAnswer || 'Не выбрано'}
              </Typography>
            </Box>

            {/* Правильный ответ (только если неправильно) */}
            {!review.isCorrect && (
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Правильный ответ:
                </Typography>
                <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 500 }}>
                  {review.correctAnswer}
                </Typography>
              </Box>
            )}

            {/* Пояснение (если есть) */}
            {review.explanation && (
              <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  <ErrorIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  {review.explanation}
                </Typography>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};