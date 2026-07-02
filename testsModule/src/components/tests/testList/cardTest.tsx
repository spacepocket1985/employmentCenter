// Описание: Карточка теста для отображения в списке
// Содержит заголовок, описание, метаданные и кнопку действия

import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';

import type { TestType } from 'src/types/tests.types';
import { TestHeader, TestMeta, TestActions } from '@components/tests';

/**
 * Props для TestCard
 */
type TestCardProps = {
  /** Данные теста */
  test: TestType;
  /** Обработчик начала теста */
  onStart: (test: TestType) => void;
};

/**
 * Карточка теста в списке
 * Отображает всю информацию о тесте и кнопку для начала
 */
export const TestCard: React.FC<TestCardProps> = ({
  test,
  onStart,
}: TestCardProps): React.ReactElement => {
  const handleStart = (): void => {
    onStart(test);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 2.5,
        transition: 'all 0.25s ease-in-out',
        borderRadius: 2,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          borderColor: '#103896',
        },
        border: '1px solid',
        borderColor: 'transparent',
      }}
    >
      <TestHeader title={test.title} category={test.category} />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 2.5,
          pl: 7, // Отступ под иконку
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {test.description}
      </Typography>

      <Divider sx={{ mb: 2.5 }} />

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <TestMeta
          questionCount={test.questions.length}
          estimatedTime={test.estimatedTime}
          category={test.category}
          isActive={test.isActive}
        />

        <TestActions onStart={handleStart} isActive={test.isActive} />
      </Box>
    </Paper>
  );
};
