// Data Model Layer:

import { Schema, model, ObjectId } from 'mongoose';

export type EmployeeType = {
  _id: ObjectId;
  name: string;
  job: string;
  department: string;
  birthday: string;
  groups?: string[];
};

const employeeSchema = new Schema<EmployeeType>(
  {
    name: {
      type: String,
      required: [true, 'Name should not be empty!'],
    },
    job: {
      type: String,
      required: [true, 'Job should not be empty!'],
    },
    department: {
      type: String,
      required: [true, 'Department should not be empty!'],
    },
    birthday: {
      type: String,
      required: [true, 'Birthday should not be empty!'],
    },
    groups: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const Employee = model<EmployeeType>('Employee', employeeSchema);
