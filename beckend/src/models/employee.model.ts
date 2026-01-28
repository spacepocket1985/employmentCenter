// Data Model Layer:

import { Schema, model, ObjectId } from 'mongoose';

export type EmployeeType = {
  _id: ObjectId;
  name: string;
  job: string;
  department: string;
  birthday: string;
  groups?: string[];
  orderIndex?: number;        // Общий индекс для сортировки
  responsibleOrder?: number;  // Специфичный для ответственных на выходных
  safetyOrder?: number;       // Специфичный для безопасности труда
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
    orderIndex: {
      type: Number,
      default: 0,
    },
    responsibleOrder: {
      type: Number,
      default: 0,
    },
    safetyOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Employee = model<EmployeeType>('Employee', employeeSchema);