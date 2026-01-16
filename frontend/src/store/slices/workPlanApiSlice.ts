import { api, planUrl } from '@store/config';
import {
  ApiResponse,
  CreateWorkPlanRequest,
  UpdateWorkPlanRequest,
  WorkPlan,
} from 'src/types/workPlan.types';

export const workPlanApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Создать план
    createWorkPlan: builder.mutation<
      ApiResponse<WorkPlan>,
      CreateWorkPlanRequest
    >({
      query: (workPlanData) => ({
        url: planUrl,
        method: 'POST',
        body: workPlanData,
      }),
      invalidatesTags: ['WorkPlan'],
    }),

    // Получить все планы
    getAllWorkPlans: builder.query<ApiResponse<WorkPlan[]>, void>({
      query: () => ({
        url: planUrl,
        method: 'GET',
      }),
      providesTags: ['WorkPlan'],
    }),

    // Получить план по ID
    getWorkPlanById: builder.query<ApiResponse<WorkPlan>, string>({
      query: (id) => ({
        url: `${planUrl}/${id}`,
        method: 'GET',
      }),
      providesTags: ['WorkPlan'],
    }),

    // Обновить план
    updateWorkPlan: builder.mutation<
      ApiResponse<WorkPlan>,
      { id: string; data: UpdateWorkPlanRequest }
    >({
      query: ({ id, data }) => ({
        url: `${planUrl}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['WorkPlan'],
    }),

    // Удалить план
    deleteWorkPlan: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `${planUrl}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WorkPlan'],
    }),
  }),
});

export const {
  useCreateWorkPlanMutation,
  useGetAllWorkPlansQuery,
  useGetWorkPlanByIdQuery,
  useUpdateWorkPlanMutation,
  useDeleteWorkPlanMutation,
} = workPlanApi;
