// Описание: Хук для отправки результатов теста
// Использует request для POST запроса

import { useState, useCallback } from 'react';

import { 
  submitStart,
  submitEnd,
  setResult,
  setError,
} from '@store/slices/testSlice';
import { submitTestResults } from '@api/testsApi';
import type { 
  TestSubmissionModel, 
  TestResultType,
  TestResultApiResponse,
} from 'src/types/tests.types';
import { useAppDispatch } from '@hooks/storeHooks';

/**
 * Хук для отправки результатов теста
 * @returns Объект с функцией отправки и состоянием
 */
export const useSubmitTest = (): {
  submit: (data: TestSubmissionModel) => Promise<TestResultType | null>;
  isSubmitting: boolean;
  error: string | null;
} => {
  const dispatch = useAppDispatch();
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setErrorState] = useState<string | null>(null);

  /**
   * Отправка результатов теста
   * @param data - Данные для отправки
   * @returns Результат теста или null в случае ошибки
   */
  const submit = useCallback(
    async (data: TestSubmissionModel): Promise<TestResultType | null> => {
      try {
        // Начинаем отправку
        setIsSubmitting(true);
        setErrorState(null);
        dispatch(submitStart());

        // Отправляем запрос
        const response: TestResultApiResponse = await submitTestResults(data);

        // Сохраняем результат в store
        if (response.data) {
          dispatch(setResult(response.data));
          return response.data;
        }

        return null;
      } catch (err: unknown) {
        const errorMessage: string = err instanceof Error 
          ? err.message 
          : 'Неизвестная ошибка при отправке';
        
        setErrorState(errorMessage);
        dispatch(setError(errorMessage));
        
        return null;
      } finally {
        // Завершаем отправку
        setIsSubmitting(false);
        dispatch(submitEnd());
      }
    },
    [dispatch]
  );

  return {
    submit,
    isSubmitting,
    error,
  };
};