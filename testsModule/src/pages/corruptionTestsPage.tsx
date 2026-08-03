// Описание: Страница со списком тестов по коррупции
// Загружает тесты только категории "Антикоррупционное обучение"

import React from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import { selectAllTests, setTests, setError } from '@store/slices/testSlice';
import { fetchTestThunk } from '@store/slices/testSlice';
import { PageTitle } from '@components/layout';
import { TestList } from '@components/tests';
import { useApi } from '@hooks/useApi';
import type { TestType, TestsApiResponse } from 'src/types/tests.types';

/**
 * Страница со списком коррупционных тестов
 */
export const CorruptionTestsPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Загружаем только тесты по коррупции
  const { loading, error, refetch } = useApi<TestsApiResponse>(
    'tests/category/Антикоррупционное обучение',
    { method: 'GET' },
    {
      autoLoad: true,
      onSuccess: (response: TestsApiResponse): void => {
        if (response.data) {
          dispatch(setTests(response.data));
        }
      },
      onError: (err: Error): void => {
        dispatch(setError(err.message));
      },
    }
  );

  // Получаем тесты из store
  const tests: TestType[] = useAppSelector(selectAllTests);

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
        title="Антикоррупционное обучение"
        subtitle="Проверьте свои знания антикоррупционного законодательства"
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