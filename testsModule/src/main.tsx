import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import App from './App';
import type { SectionType } from './App';

// Получаем корневой элемент
const rootElement = document.getElementById('root');

// Читаем data-section из HTML
const section = (rootElement?.dataset.section as SectionType) || 'psychology';

// Создаём корень
const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App section={section} />
    </Provider>
  </React.StrictMode>
);