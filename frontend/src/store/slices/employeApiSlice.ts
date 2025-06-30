import { api, employeesHBUrl, employeesUrl } from '@store/config';
import { EmployeeType, InfoFromDBType } from 'src/types/types';

export const employeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployees: builder.query<InfoFromDBType<EmployeeType[]>, void>({
      query: () => employeesUrl,
      providesTags: () => ['Employees'],
    }),
    getEmployeeTodayBirthdays: builder.query<
      InfoFromDBType<EmployeeType[]>,
      void
    >({
      query: () => employeesHBUrl,
      providesTags: () => ['Employees'],
    }),
  }),
});

export const { useGetAllEmployeesQuery, useGetEmployeeTodayBirthdaysQuery } =
  employeApi;
