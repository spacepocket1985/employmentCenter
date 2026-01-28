import { EmployeeType } from './employee.model';

export type EmployeeCreateModel = Omit<EmployeeType, '_id'> & {
  groups?: string[];
  orderIndex?: number;
  responsibleOrder?: number;
  safetyOrder?: number;
};
