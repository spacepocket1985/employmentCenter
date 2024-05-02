// Data Model Layer:
// Description: Defines the data structure for vacancies and exports the Vacancy model.

import { Schema, model, ObjectId } from 'mongoose';

export type VacancyType = {
  _id: ObjectId;
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
