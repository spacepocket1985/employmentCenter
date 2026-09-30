// Описание: Страница со списком именных тестов с логированием
// Загружает тесты категории "Охрана труда"

import React from 'react';
import { Box } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import { selectAllTests, setTests, setError } from '@store/slices/testSlice';
import { fetchTestThunk } from '@store/slices/testSlice';
import { PageTitle } from '@components/layout';
import { TestList } from '@components/tests';
import { useApi } from '@hooks/useApi';
import { testsEndpoint } from '@api/endPoints';
import type { TestType, TestsApiResponse } from 'src/types/tests.types';

/** Категория тестов для именного прохождения */
const LOGGED_TESTS_CATEGORY = 'Охрана труда';

/**
 * Страница со списком именных тестов (с логированием)
 */
export const LoggedTestsPage: React.FC = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Загружаем тесты по категории "Охрана труда"
  const { loading, error, refetch } = useApi<TestsApiResponse>(
    `${testsEndpoint}/category/${encodeURIComponent(LOGGED_TESTS_CATEGORY)}`,
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

      if (fetchTestThunk.fulfilled.match(resultAction)) {
        console.log('✅ Тест успешно загружен:', resultAction.payload.title);
      } else {
        console.error('❌ Ошибка загрузки теста:', resultAction.payload);
      }
    } catch (error) {
      console.error('❌ Ошибка при старте теста:', error);
    }
  };

  return (
    <Box>
      <PageTitle
        title="Охрана труда"
        subtitle="Проверка знаний мастеров"
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