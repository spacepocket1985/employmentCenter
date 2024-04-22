import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { InfoFromDBType, VacancyType } from '../../types/types';

export const serverEndPoint = 'http://10.182.1.143:5000';
export const baseUrl = '/vacancies';

// Создание API Slice с использованием RTK Query
 export const vacanciesApiSlice = createApi({
  reducerPath: 'vacanciesApi',
  baseQuery: fetchBaseQuery({ baseUrl: serverEndPoint }), // Установка базового URL для запросов
  tagTypes: ['Vacancies'], 
  endpoints: (builder) => ({
    // Запрос для получения всех вакансий
    getAllVacancies: builder.query<InfoFromDBType<VacancyType[]>, void>({
      query: () => baseUrl,
      providesTags: () => ['Vacancies'] 
    }),
    getVacancy: builder.query<InfoFromDBType<VacancyType>, string>({
      query: (id) => ({
        url: `/vacancies/${id}`,
        method: 'GET',
      }),
    }),
    // Мутация для добавления новой вакансии
    addNewVacancy: builder.mutation<InfoFromDBType<VacancyType>, VacancyType>({
      query: (vacancy) => ({
        url: baseUrl,
        method: 'POST',
        body: vacancy,
      }),
      invalidatesTags: ['Vacancies'] 
    }),
    // Мутация для обновления вакансии
    updateVacancy: builder.mutation<InfoFromDBType<VacancyType>, VacancyType>({
      query: (vacancy) => ({
        url: `${baseUrl}/${vacancy._id}`,
        method: 'PATCH',
        body: vacancy,
      }),
      invalidatesTags: ['Vacancies']
    }),
    // Мутация для удаления вакансии
    deleteVacancy: builder.mutation<InfoFromDBType<void>, string>({
      query: (id) => ({
        url: `/vacancies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vacancies']
    }),
  }),
});

// Экспорт хуков для использования в компонентах
export const {
  useGetAllVacanciesQuery,
  useGetVacancyQuery,
  useAddNewVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
} = vacanciesApiSlice;

