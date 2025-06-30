import { vacancyUrl, authUrl, api } from '@store/config';
import {
  InfoFromDBType,
  VacancyType,
  UserInfoFromDBType,
  UserType,
} from 'src/types/types';

export const vacanciesApiSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllVacancies: builder.query<InfoFromDBType<VacancyType[]>, void>({
      query: () => vacancyUrl,
      providesTags: () => ['Vacancies'],
    }),
    getVacancy: builder.query<InfoFromDBType<VacancyType>, string>({
      query: (id) => ({
        url: `${vacancyUrl}/${id}`,
        method: 'GET',
      }),
    }),

    addNewVacancy: builder.mutation<InfoFromDBType<VacancyType>, VacancyType>({
      query: (vacancy) => ({
        url: vacancyUrl,
        method: 'POST',
        body: vacancy,
      }),
      invalidatesTags: ['Vacancies'],
    }),

    updateVacancy: builder.mutation<InfoFromDBType<VacancyType>, VacancyType>({
      query: (vacancy) => ({
        url: `${vacancyUrl}/${vacancy._id}`,
        method: 'PATCH',
        body: vacancy,
      }),
      invalidatesTags: ['Vacancies'],
    }),

    deleteVacancy: builder.mutation<InfoFromDBType<void>, string>({
      query: (id) => ({
        url: `${vacancyUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vacancies'],
    }),
    loginUser: builder.mutation<InfoFromDBType<UserInfoFromDBType>, UserType>({
      query: (user) => ({
        url: authUrl,
        method: 'POST',
        body: user,
      }),
    }),
  }),
});

export const {
  useGetAllVacanciesQuery,
  useGetVacancyQuery,
  useAddNewVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
  useLoginUserMutation,
} = vacanciesApiSlice;
