// Описание: Страница со списком тестов
// Загружает тесты с бэкенда и показывает их

import React from 'react';
import { Box } from '@mui/material';
import { useTests } from '@hooks/useTests';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import { 
  startTest, 
  selectAllTests,
} from '@store/slices/testSlice';
import { PageTitle } from '@components/layout';
import { TestList } from '@components/tests/';
import type { TestType } from 'src/types/tests.types';

/**
 * Страница со списком тестов
 */
export const TestsPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  
  // Загружаем тесты
  const { loading, error, refetch } = useTests();

  // Получаем тесты из store
  const tests: TestType[] = useAppSelector(selectAllTests);

  // Обработчик начала теста
  const handleStartTest = (test: TestType): void => {
    dispatch(startTest(test));
  };

  return (
    <Box sx={{ p: 2 }}>
      <PageTitle 
        title="Психологические тесты"
        subtitle="Выберите тест и узнайте больше о себе"
      />
      
      <TestList
        tests={tests}
        isLoading={loading}
        error={error}
        onRetry={refetch}
        onStartTest={handleStartTest}
      />
    </Box>
  );
};