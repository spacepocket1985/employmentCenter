export type VacancyType = {
  _id?: string;
  title: string;
  wageRate: number;
  education: string;
  experience: string;
  salary: number;
  additionalInformation: string;
};

export type UserType = {
  name: string;
  password: string;
};

export type UserInfoFromDBType = {
  name: string | null;
  token: string | null;
};

export type InfoFromDBType<T> = {
  msg: string;
  data: T;
};

export type ErrorDataType = {
  status: number;
  data: {
    message: string;
  };
};
