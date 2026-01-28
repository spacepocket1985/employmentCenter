import { ScheduleEntry } from '../types/schedule.types';

export type ScheduleUpdateModel = {
  entries?: Omit<ScheduleEntry, '_id'>[];
  isPublished?: boolean;
  notes?: string;
};
