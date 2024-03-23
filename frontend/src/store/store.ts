import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import vacanciesReducer from './slices/vacanciesSlice';

const rootReducer = combineReducers({ vacancies: vacanciesReducer });

export const store = configureStore({ reducer: rootReducer });

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
