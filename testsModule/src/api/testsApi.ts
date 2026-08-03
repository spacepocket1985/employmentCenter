// Описание: API функции для работы с тестами
// Содержит все запросы к бэкенду

import { request } from './baseRequest';
import {
  testsEndpoint,
  submitTestEndpoint,
} from './endPoints';
import type {
  TestsApiResponse,
  TestApiResponse,
  TestResultApiResponse,
  TestSubmissionModel,
} from 'src/types/tests.types';

/**
 * Получение всех тестов
 * GET /tests
 * @returns Promise с списком тестов
 */
export const fetchTests = (): Promise<TestsApiResponse> => {
  return request<TestsApiResponse>(testsEndpoint, { method: 'GET' });
};

/**
 * Получение теста по ID с возможностью перемешивания
 * GET /tests/:id?shuffleOptions=true
 * @param id - ID теста
 * @param shuffleOptions - перемешивать ли вопросы и ответы
 * @returns Promise с данными теста
 */
export const fetchTestById = (
  id: string,
  shuffleOptions: boolean = true
): Promise<TestApiResponse> => {
  const url = shuffleOptions
    ? `${testsEndpoint}/${id}?shuffleOptions=true`
    : `${testsEndpoint}/${id}`;
  
  return request<TestApiResponse>(url, { method: 'GET' });
};

/**
 * Отправка результатов теста
 * POST /tests/submit
 * @param data - Данные для отправки (ответы пользователя)
 * @returns Promise с результатом теста
 */
export const submitTestResults = (
  data: TestSubmissionModel
): Promise<TestResultApiResponse> => {
  return request<TestResultApiResponse>(submitTestEndpoint, {
    method: 'POST',
    body: data,
  });
};

/**
 * Получение тестов по категории
 * GET /tests/category/:category
 * @param category - Название категории
 * @returns Promise с списком тестов
 */
export const fetchTestsByCategory = (category: string): Promise<TestsApiResponse> => {
  return request<TestsApiResponse>(`${testsEndpoint}/category/${category}`, {
    method: 'GET',
  });
};