import { Schema, model } from 'mongoose';

export type VacancyType = {
  id: string;
  title: string;
  wageRate: number;
  education: string;
  experience: string;
  additionalInformation: string;
  salary: number;
};

const vacancySchema = new Schema<VacancyType>(
  {
    title: {
      type: String,
      required: [true, 'Title should not be empty!'],
    },

    wageRate: {
      type: Number,
      required: [true, 'Wage rate should not be empty!'],
    },
    education: {
      type: String,
      required: [true, 'Education should not be empty!'],
    },
    experience: {
      type: String,
      required: [true, 'Experience should not be empty!'],
    },
    additionalInformation: {
      type: String,
      required: [true, 'AdditionalInformation should not be empty!'],
    },
    salary: {
      type: Number,
      required: [true, 'Number should not be empty!'],
    },
  },
  { timestamps: true }
);

export const Vacancy = model<VacancyType>('Vacancy', vacancySchema);
