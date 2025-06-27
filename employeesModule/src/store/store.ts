import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import { employeesApiSlice } from './slices/apiSlice';

const rootReducer = combineReducers({
  [employeesApiSlice.reducerPath]: employeesApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(employeesApiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
