// Описание: Компонент навигации приложения
// Определяет, какую страницу показывать на основе состояния Redux

import React from 'react';
import { Container, Box } from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';
import { selectIsTesting, selectIsResult } from '@store/slices/testSlice';
import { PsychologyTestsPage } from '@pages/psychologyTestsPage';
import { CorruptionTestsPage } from '@pages/corruptionTestsPage';
import { TestTakingPage } from '@pages/testTakingPage';
import { TestResultPage } from '@pages/testResultPage';

/**
 * Props для AppNavigation
 */
type AppNavigationProps = {
  /** Тип страницы: 'psychology' или 'corruption' */
  pageType: 'psychology' | 'corruption';
};

/**
 * Компонент навигации
 * Определяет, какую страницу показывать на основе состояния
 */
export const AppNavigation: React.FC<AppNavigationProps> = ({
  pageType,
}): React.ReactElement => {
  // Получаем состояние из Redux

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

    // В зависимости от типа страницы показываем нужный список
    if (pageType === 'corruption') {
      return <CorruptionTestsPage />;
    }

    // По умолчанию (psychology) показываем психологические тесты
    return <PsychologyTestsPage />;
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>{renderPage()}</Box>
    </Container>
  );
};
