import { WorkPlan } from 'src/types/plan.types';
import { PlanEndpoint } from './endPoints';
import { request } from './baseRequest';
import { ApiResponse } from 'src/types/';

// Тип ответа от API для плана
type GetPlanResponse = {
  data: WorkPlan;
  msg: string;
};

// Получить текущий план
export async function getCurrentPlan(): Promise<ApiResponse<WorkPlan>> {
  try {
    const response = await request<GetPlanResponse>(PlanEndpoint);

    return {
      success: true,
      message: response.msg,
      data: response.data,
    };
  } catch (error) {
    console.error('Failed to fetch plan:', error);
    return {
      success: false,
      message: (error as Error).message || 'Не удалось загрузить план',
      errors: [(error as Error).message],
    };
  }
}
