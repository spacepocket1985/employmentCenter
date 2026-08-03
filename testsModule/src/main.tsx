import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '@store/store';
import App from './App';

const rootElement = document.getElementById('psy-tests');
//const rootElement = document.getElementById('corruption-tests');
// const rootElement = document.getElementById('root');
const pageType =
  (rootElement?.dataset.pageType as 'psychology' | 'corruption') ||
  'psychology';

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App pageType={pageType} />
    </Provider>
  </React.StrictMode>
);
