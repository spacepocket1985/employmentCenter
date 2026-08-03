// Описание: Страница со списком психологических тестов
// Загружает все тесты без фильтрации

import React from 'react';
import { Box } from '@mui/material';
import { useTests } from '@hooks/useTests';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import { selectTestsWithoutCoruption } from '@store/slices/testSlice';
import { fetchTestThunk } from '@store/slices/testSlice';
import { PageTitle } from '@components/layout';
import { TestList } from '@components/tests';
import type { TestType } from 'src/types/tests.types';

/**
 * Страница со списком психологических тестов
 */
export const PsychologyTestsPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Загружаем все тесты (без категории)
  const { loading, error, refetch } = useTests();

  // Получаем тесты из store
  const tests: TestType[] = useAppSelector(selectTestsWithoutCoruption);

  // Обработчик начала теста
  const handleStartTest = async (test: TestType): Promise<void> => {
    try {
      // Загружаем тест с перемешиванием вопросов и ответов
      const resultAction = await dispatch(
        fetchTestThunk({
          testId: test._id,
          shuffleOptions: true,
        })
      );

      // Проверяем, успешно ли загружен тест
      if (fetchTestThunk.fulfilled.match(resultAction)) {
        // Тест загружен, страница переключится автоматически
        // (pageState меняется на 'testing' в extraReducers)
        console.log('Тест успешно загружен:', resultAction.payload.title);
      } else {
        console.error('Ошибка загрузки теста:', resultAction.payload);
      }
    } catch (error) {
      console.error('Ошибка при старте теста:', error);
    }
  };

  return (
    <Box>
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