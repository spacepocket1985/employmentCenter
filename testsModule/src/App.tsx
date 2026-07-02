// Описание: Корневой компонент приложения
// Оборачивает приложение в Redux Provider

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import { AppNavigation } from '@components/layout/';


/**
 * Корневой компонент приложения
 */
export const App: React.FC = (): React.ReactElement => {
  return (
    <Provider store={store}>
      <AppNavigation />

    </Provider>
  );
};

export default App;