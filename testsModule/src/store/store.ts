// Описание: Конфигурация Redux store
// Объединяет все слайсы и настраивает middleware

import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

// Импорт слайса для тестов
import testReducer from './slices/testSlice';

// ============================================
// КОРНЕВОЙ REDUCER
// ============================================

/**
 * Корневой редьюсер
 * Объединяет все слайсы приложения
 */
const rootReducer = combineReducers({
  test: testReducer,
});

// ============================================
// КОНФИГУРАЦИЯ STORE
// ============================================

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['test/setResult'],
      },
    });
  },
});

// ============================================
// ТИПЫ ДЛЯ ХУКОВ
// ============================================

/**
 * Тип корневого состояния
 * Выводится автоматически из rootReducer
 */
export type AppRootState = ReturnType<typeof rootReducer>;

/**
 * Тип для dispatch
 */
export type AppDispatch = typeof store.dispatch;