// Описание: Компонент навигации приложения
// Определяет, какую страницу показывать на основе состояния Redux

import React from 'react';
import { Container, Box } from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';
import {
  selectIsIdle,
  selectIsTesting,
  selectIsResult,
} from '@store/slices/testSlice';
import { TestsPage } from '@pages/testsPage';
import { TestTakingPage } from '@pages/testTakingPage';
import { TestResultPage } from '@pages/testResultPage';

/**
 * Компонент навигации
 * Определяет, какую страницу показывать на основе состояния
 */
export const AppNavigation: React.FC = (): React.ReactElement => {
  // Получаем состояние из Redux
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isIdle: boolean = useAppSelector(selectIsIdle);
  const isTesting: boolean = useAppSelector(selectIsTesting);
  const isResult: boolean = useAppSelector(selectIsResult);

  // Определяем, какую страницу рендерить
  const renderPage = (): React.ReactElement => {
    if (isTesting) {
      return <TestTakingPage />;
    }

    if (isResult) {
      return <TestResultPage />;
    }

    // По умолчанию (isIdle) показываем список тестов
    return <TestsPage />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        {renderPage()}
      </Box>
    </Container>
  );
};