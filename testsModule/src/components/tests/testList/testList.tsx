// Описание: Компонент списка тестов
// Отображает все тесты в виде карточек

import React from 'react';
import { Box, Typography } from '@mui/material';
import { TestCard } from '@components/tests';
import { LoadingErrorWrapper } from '@components/layout';
import type { TestType } from 'src/types/tests.types';

/**
 * Props для TestList
 */
type TestListProps = {
  /** Массив тестов */
  tests: TestType[];
  /** Флаг загрузки */
  isLoading: boolean;
  /** Ошибка (если есть) */
  error?: Error | null;
  /** Функция повторной загрузки */
  onRetry?: () => void;
  /** Обработчик начала теста */
  onStartTest: (test: TestType) => void;
};

/**
 * Компонент списка тестов
 * Отображает список тестов в виде карточек с возможностью начать прохождение
 */
export const TestList: React.FC<TestListProps> = ({
  tests,
  isLoading,
  error,
  onRetry,
  onStartTest,
}: TestListProps): React.ReactElement => {
  // Если нет тестов и не идет загрузка
  if (!isLoading && tests.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Нет доступных тестов
        </Typography>
      </Box>
    );
  }

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      collectionLength={tests.length}
      collectionTitle="Тестов"
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tests.map((test: TestType) => (
          <TestCard key={test._id} test={test} onStart={onStartTest} />
        ))}
      </Box>
    </LoadingErrorWrapper>
  );
};
