import { ScheduleModel } from 'src/types/schedule.types';
import { SchedulesEndpoint } from './endPoints';
import { request } from './baseRequest';
import { ApiResponse } from 'src/types/';

// Тип ответа от API
type GetSchedulesResponse = {
  data: ScheduleModel[];
  msg: string;
};

export async function getCurrentSchedules(): Promise<
  ApiResponse<ScheduleModel[]>
> {
  try {
    const response = await request<GetSchedulesResponse>(SchedulesEndpoint);

    return {
      success: true,
      message: response.msg,
      data: response.data, // Отдаем массив графиков
    };
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    return {
      success: false,
      message: (error as Error).message || 'Не удалось загрузить графики',
      errors: [(error as Error).message],
    };
  }
}
