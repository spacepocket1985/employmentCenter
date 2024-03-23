export type VacancyType = {
  id: string;
  title: string;
  wageRate: number;
  education: string;
  salary: number;
};

export type VacancyInfoFromDBType = {
  msg: string;
  vacancies: Array<VacancyType>;
};
