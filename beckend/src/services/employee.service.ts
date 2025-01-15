// Service level (Business Logic Layer):
// Description: Implements the logic for working with data.

import { Employee, EmployeeType } from "../models/employee.model";
import { EmployeeCreateModel } from "../models/employeeCreateModel";


class EmployeeService {
  async getAllEmployees() {
    return await Employee.find({}).sort("-createdAt");
  }

  async createEmployee(newEmployeeData: EmployeeCreateModel) {
    return await Employee.create(newEmployeeData);
  }

  async getEmployee(id: string) {
    return await Employee.findById(id);
  }

  async updateEmployee(id: string, updatedEmployeeData: EmployeeType) {
    return await Employee.findByIdAndUpdate(id, updatedEmployeeData, {
      new: true,
    });
  }

  async deleteEmployee(id: string) {
    return await Employee.findByIdAndDelete(id);
  }
}

export const employeeService = new EmployeeService();
