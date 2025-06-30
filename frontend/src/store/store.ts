import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { api } from './config';

import dataReducer from '@store/slices/dataSlice';
import userReducer from '@store/slices/userSlice';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  data: dataReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// https://redux-toolkit.js.org/tutorials/typescript

export type AppRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
