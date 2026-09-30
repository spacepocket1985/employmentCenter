// Описание: Компонент навигации приложения
// Определяет, какую страницу показывать на основе состояния Redux

import React from 'react';
import { Container, Box } from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';
import { selectIsTesting, selectIsResult } from '@store/slices/testSlice';
import { PsychologyTestsPage } from '@pages/psychologyTestsPage';
import { CorruptionTestsPage } from '@pages/corruptionTestsPage';
import { LoggedTestsPage } from '@pages/loggedTestsPage';
import { TestTakingPage } from '@pages/testTakingPage';
import { TestResultPage } from '@pages/testResultPage';
import type { SectionType } from '../../App';

/**
 * Props для AppNavigation
 */
type AppNavigationProps = {
  /** Раздел приложения */
  section: SectionType;
};

/**
 * Компонент навигации
 * Определяет, какую страницу показывать на основе состояния
 */
export const AppNavigation: React.FC<AppNavigationProps> = ({
  section,
}): React.ReactElement => {
  // Получаем состояние из Redux
  const isTesting: boolean = useAppSelector(selectIsTesting);
  const isResult: boolean = useAppSelector(selectIsResult);

  // Определяем, какую страницу рендерить
  const renderPage = (): React.ReactElement => {
    // Приоритет: прохождение теста или результат
    if (isTesting) {
      return <TestTakingPage />;
    }

    if (isResult) {
      return <TestResultPage />;
    }

    // В зависимости от раздела показываем нужный список
    switch (section) {
      case 'corruption':
        return <CorruptionTestsPage />;

      case 'registeredTests':
        return <LoggedTestsPage />;

      case 'psychology':
      default:
        return <PsychologyTestsPage />;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>{renderPage()}</Box>
    </Container>
  );
};