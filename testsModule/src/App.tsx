// Описание: Корневой компонент приложения
// Оборачивает приложение в Redux Provider

import React from 'react';
import { AppNavigation } from '@components/layout';

type AppProps = {
  pageType: 'psychology' | 'corruption';
};

export const App: React.FC<AppProps> = ({ pageType }): React.ReactElement => {
  return <AppNavigation pageType={'psychology'} />;
};

export default App;
