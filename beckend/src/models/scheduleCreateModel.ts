import { ScheduleEntry } from '../types/schedule.types';

export type ScheduleCreateModel = {
  month: string;
  scheduleType: 'responsibleOnWeekends' | 'safetyOfficers';
  entries: Omit<ScheduleEntry, '_id'>[];
  notes?: string;
};

export type ScheduleEntryCreateModel = Omit<ScheduleEntry, '_id'>;
