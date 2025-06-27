import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { EmployeeType, InfoFromDBType } from '../../types/types';

export const serverEndPoint = 'http://localhost:5000/';
// 'http://10.182.1.143:5000';

export const employeesUrl = '/employees';
export const employeesHBUrl = '/employees/hb';

export const employeesApiSlice = createApi({
  reducerPath: 'employeesApi',
  baseQuery: fetchBaseQuery({ baseUrl: serverEndPoint }),
  tagTypes: ['employees'],
  endpoints: (builder) => ({
    getAllEmployees: builder.query<InfoFromDBType<EmployeeType[]>, void>({
      query: () => employeesUrl,
      providesTags: () => ['employees'],
    }),
    getEmployeeTodayBirthdays: builder.query<
      InfoFromDBType<EmployeeType[]>,
      void
    >({
      query: () => employeesHBUrl,
      providesTags: () => ['employees'],
    }),
  }),
});

export const { useGetAllEmployeesQuery, useGetEmployeeTodayBirthdaysQuery } =
  employeesApiSlice;
