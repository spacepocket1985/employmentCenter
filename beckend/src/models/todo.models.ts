import { Schema, model } from "mongoose";

// Creating an interface
interface Vacancy {
  title: string;
  wageRate: number;
  education: string;
  salary: number;
}

const vacancySchema = new Schema<Vacancy>(
  {
    title: {
      type: String,
      required: [true, "Title should not be empty!"],
    },

    wageRate: {
      type: Number,
      required: [true, "Wage rate should not be empty!"],
    },
    education: {
      type: String,
      required: [true, "Education should not be empty!"],
    },
    salary: {
      type: Number,
      required: [true, "Number should not be empty!"],
    },
  },
  { timestamps: true }
);

export const Vacancy = model<Vacancy>("Vacancy", vacancySchema);
