import { useCallback } from 'react';
import { getCurrentPlan } from '@api/planApi';
import { WorkPlan } from 'src/types/plan.types';
import { useApiData, UseApiDataReturn, UseApiDataConfig } from './useApiData';

export type UsePlanDataReturn = UseApiDataReturn<WorkPlan>;
export type UsePlanDataConfig = UseApiDataConfig<void>;

export const usePlanData = (config?: UsePlanDataConfig): UsePlanDataReturn => {
  const fetchPlan = useCallback(() => getCurrentPlan(), []);
  return useApiData<WorkPlan>(fetchPlan, config);
};