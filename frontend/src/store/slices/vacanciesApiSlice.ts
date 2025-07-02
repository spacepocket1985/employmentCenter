import { vacancyUrl, api } from '@store/config';
import { InfoFromDBType, VacancyType } from 'src/types/types';

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
  }),
});

export const {
  useGetAllVacanciesQuery,
  useGetVacancyQuery,
  useAddNewVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
} = vacanciesApiSlice;
