// Описание: Корневой компонент приложения
// Оборачивает приложение в Redux Provider

import React from 'react';
import { AppNavigation } from '@components/layout';

/**
 * Возможные разделы приложения
 * - psychology: психологические тесты (анонимные)
 * - corruption: антикоррупционные тесты (анонимные)
 * - registeredTests: именные тесты с логированием (День мастера и т.д.)
 */
export type SectionType = 'psychology' | 'corruption' | 'registeredTests';

/**
 * Props для App
 */
type AppProps = {
  /** Раздел приложения */
  section: SectionType;
};

/**
 * Корневой компонент приложения
 */
export const App: React.FC<AppProps> = ({ section }): React.ReactElement => {
  return <AppNavigation section={section} />;
};

export default App;