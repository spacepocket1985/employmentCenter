import {
  api,
  employeeSearch,
  employeesHBUrl,
  employeesUrl,
} from '@store/config';
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
    getEmployeesByName: builder.query<InfoFromDBType<EmployeeType[]>, string>({
      query: (name) => ({
        url: `${employeeSearch}/${name}`,
        method: 'GET',
        providesTags: () => ['Employees'],
      }),
    }),
    addNewEmployee: builder.mutation<
      InfoFromDBType<EmployeeType>,
      EmployeeType
    >({
      query: (employee) => ({
        url: employeesUrl,
        method: 'POST',
        body: employee,
      }),
      invalidatesTags: ['Employees'],
    }),
    updateEmployee: builder.mutation<
      InfoFromDBType<EmployeeType>,
      EmployeeType
    >({
      query: (employee) => ({
        url: `${employeesUrl}/${employee._id}`,
        method: 'PATCH',
        body: employee,
      }),
      invalidatesTags: ['Employees'],
    }),
    deleteEmployee: builder.mutation<InfoFromDBType<void>, string>({
      query: (id) => ({
        url: `${employeesUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employees'],
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeTodayBirthdaysQuery,
  useAddNewEmployeeMutation,
  useDeleteEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeesByNameQuery,
} = employeApi;
