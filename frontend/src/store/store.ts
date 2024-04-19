import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import vacanciesReducer from './slices/vacanciesSlice';
import infoReducer from './slices/infoSlice';
import dataReducer from './slices/dataSlice';
import userReducer from './slices/userSlice';
import { vacanciesApiSlice } from './slices/vacanciesApiSlice';

const rootReducer = combineReducers({
  vacancies: vacanciesReducer,
  [vacanciesApiSlice.reducerPath]: vacanciesApiSlice.reducer,
  info: infoReducer,
  data: dataReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(vacanciesApiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
