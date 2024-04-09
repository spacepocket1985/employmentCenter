export type VacancyType = {
  _id?: string;
  title: string;
  wageRate: number;
  education: string;
  experience: string;
  salary: number;
};

export type UserType = {
  name: string;
  password: string;
};

export type VacancyInfoFromDBType = {
  msg: string;
  vacancies: Array<VacancyType> | VacancyType;
};

export type InfoFromDBType<T> = {
  msg: string;
  data: T;
};


