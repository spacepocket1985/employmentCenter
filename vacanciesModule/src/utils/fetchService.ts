import { VacancyType, InfoFromDBType } from '../types/types';

export const ServerURL = 'http://10.182.1.143:5000';
export const VacanciesUrl = 'vacancies';

export const getVacancies = async (): Promise<VacancyType[]> => {
  const response = await fetch(`${ServerURL}/${VacanciesUrl}`);
  if (!response.ok) {
    throw new Error(`Ошибка при получении данных: ${response.status}`);
  }
  const data: InfoFromDBType<VacancyType[]> = await response.json();
  return data.data;
};
