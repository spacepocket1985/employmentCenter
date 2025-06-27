// Service level (Business Logic Layer):
// Description: Implements the logic for working with data.

import { Employee, EmployeeType } from '../models/employee.model';
import { EmployeeCreateModel } from '../models/employeeCreateModel';

class EmployeeService {
  async getAllEmployees() {
    return await Employee.find({}).sort('-createdAt');
  }
  async getHBEmployees() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = this.formatDate(today);
    
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);
    twoDaysLater.setHours(23, 59, 59, 999);
    const twoDaysLaterStr = this.formatDate(twoDaysLater);
  
    const currentYear = today.getFullYear();
    
    // Получаем всех сотрудников
    const allEmployees = await Employee.find({});
    
    return allEmployees.filter(employee => {
      // Создаем дату в текущем году
      const birthdayThisYear = `${currentYear}-${employee.birthday.substring(5)}`;
      
      // Проверяем, попадает ли день рождения в диапазон
      return birthdayThisYear >= todayStr && birthdayThisYear <= twoDaysLaterStr;
    }).sort((a, b) => {
      // Сортируем по дате (от ближайшего)
      const aDate = a.birthday.substring(5);
      const bDate = b.birthday.substring(5);
      return aDate.localeCompare(bDate);
    });
  }
  
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
