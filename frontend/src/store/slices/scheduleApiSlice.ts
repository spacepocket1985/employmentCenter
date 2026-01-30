// store/slices/scheduleApiSlice.ts

import { api } from '@store/config';
import { ScheduleCreateModel, ScheduleType, ScheduleUpdateModel } from 'src/types/schedule.types';
import { EmployeeType, EmployeeViewModel } from 'src/types/types';


export const scheduleApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Получить всех ответственных на выходных (с сортировкой)
    getResponsibleOnWeekends: builder.query<
      EmployeeViewModel<EmployeeType[]>,
      void
    >({
      query: () => ({
        url: '/employees/responsibleOnWeekends',
        method: 'GET',
      }),
      providesTags: ['Schedule'],
    }),

    // Получить всех safety officers (с сортировкой)
    getSafetyOfficers: builder.query<EmployeeViewModel<EmployeeType[]>, void>({
      query: () => ({
        url: '/employees/safetyOfficers',
        method: 'GET',
      }),
      providesTags: ['Schedule'],
    }),

    // Получить графики с фильтрацией
    getSchedules: builder.query<
      EmployeeViewModel<ScheduleType[]>,
      { month?: string; scheduleType?: string }
    >({
      query: (params) => ({
        url: '/schedules',
        method: 'GET',
        params,
      }),
      providesTags: ['Schedule'],
    }),

    // Получить график по месяцу и типу
    getScheduleByMonthAndType: builder.query<
      EmployeeViewModel<ScheduleType>,
      { month: string; scheduleType: string }
    >({
      query: ({ month, scheduleType }) => ({
        url: `/schedules/${month}/${scheduleType}`,
        method: 'GET',
      }),
      providesTags: ['Schedule'],
    }),

    // Создать график
    createSchedule: builder.mutation<
      EmployeeViewModel<ScheduleType>,
      ScheduleCreateModel
    >({
      query: (scheduleData) => ({
        url: '/schedules',
        method: 'POST',
        body: scheduleData,
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Создать график из шаблона (автозаполнение)
    createScheduleFromTemplate: builder.mutation<
      EmployeeViewModel<ScheduleType>,
      {
        month: string;
        scheduleType: 'responsibleOnWeekends' | 'safetyOfficers';
      }
    >({
      query: (templateData) => ({
        url: '/schedules/template',
        method: 'POST',
        body: templateData,
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Обновить график
    updateSchedule: builder.mutation<
      EmployeeViewModel<ScheduleType>,
      { id: string; data: ScheduleUpdateModel }
    >({
      query: ({ id, data }) => ({
        url: `/schedules/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Удалить график
    deleteSchedule: builder.mutation<EmployeeViewModel<ScheduleType>, string>({
      query: (id) => ({
        url: `/schedules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule'],
    }),

    // Публикация графика
    toggleSchedulePublish: builder.mutation<
      EmployeeViewModel<ScheduleType>,
      string
    >({
      query: (id) => ({
        url: `/schedules/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Schedule'],
    }),
  }),
});

export const {
  useGetResponsibleOnWeekendsQuery,
  useGetSafetyOfficersQuery,
  useGetSchedulesQuery,
  useGetScheduleByMonthAndTypeQuery,
  useCreateScheduleMutation,
  useCreateScheduleFromTemplateMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
  useToggleSchedulePublishMutation,
} = scheduleApi;
