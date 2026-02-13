import { useCallback } from 'react';
import { getCurrentSchedules } from '@api/scheduleApi';
import { ScheduleModel } from 'src/types/schedule.types';
import { useApiData, UseApiDataReturn, UseApiDataConfig } from './useApiData';

export type UseSchedulesDataReturn = UseApiDataReturn<ScheduleModel[]>;
export type UseSchedulesDataConfig = UseApiDataConfig<void>;

export const useSchedulesData = (config?: UseSchedulesDataConfig): UseSchedulesDataReturn => {
  const fetchSchedules = useCallback(() => getCurrentSchedules(), []);
  return useApiData<ScheduleModel[]>(fetchSchedules, config);
};