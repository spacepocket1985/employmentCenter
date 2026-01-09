import { EmployeeType, InfoFromDBType } from '../types/types';

export const ServerURL = 'http://10.182.1.143:5000';
export const EmployeesHBUrl = 'employees/hb';

export const getEmployeeTodayBirthdays = async (): Promise<EmployeeType[]> => {
  const response = await fetch(`${ServerURL}/${EmployeesHBUrl}`);
  if (!response.ok) {
    throw new Error(`Ошибка при получении данных: ${response.status}`);
  }
  const data: InfoFromDBType<EmployeeType[]> = await response.json();
  return data.data;
};
