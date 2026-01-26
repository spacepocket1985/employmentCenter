// Service level (Business Logic Layer):
// Description: Implements the logic for working with data.

import { Employee, EmployeeType } from '../models/employee.model';
import { EmployeeCreateModel } from '../models/employeeCreateModel';

class EmployeeService {
  // Константы для иерархии групп
  private readonly GROUP_HIERARCHY = {
    // Группа safetyOfficers включает все подгруппы
    safetyOfficers: [
      'safetyOfficers',
      'responsibleOnWeekends',
      'management',
      'oniot',
    ],
    // Группа responsibleOnWeekends включает свою подгруппу
    responsibleOnWeekends: ['responsibleOnWeekends', 'management'],
    // Базовые группы (без подгрупп)
    management: ['management'],
    boss: ['boss'],
    oniot: ['oniot'],
  };

  /**
   * Получить все группы, связанные с указанной (включая саму группу и все подгруппы)
   */
  private getGroupsWithHierarchy(groupName: string): string[] {
    return (
      this.GROUP_HIERARCHY[groupName as keyof typeof this.GROUP_HIERARCHY] || [
        groupName,
      ]
    );
  }

  async getAllEmployees() {
    return await Employee.find({}).sort('-createdAt');
  }
  async getHBEmployees() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = this.formatDate(today);

    const threeDaysLater = new Date();
    threeDaysLater.setDate(today.getDate() + 2);
    threeDaysLater.setHours(23, 59, 59, 999);
    const threeDaysLaterStr = this.formatDate(threeDaysLater);

    const currentYear = today.getFullYear();

    // Получаем всех сотрудников
    const allEmployees = await Employee.find({});

    return allEmployees
      .filter((employee) => {
        // Создаем дату в текущем году
        const birthdayThisYear = `${currentYear}-${employee.birthday.substring(
          5
        )}`;

        // Проверяем, попадает ли день рождения в диапазон
        return (
          birthdayThisYear >= todayStr && birthdayThisYear <= threeDaysLaterStr
        );
      })
      .sort((a, b) => {
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

  async findEmployeesByNameStart(nameStart: string) {
    const regex = new RegExp(`^${nameStart}`, 'i');
    const employees = await Employee.find({ name: { $regex: regex } });
    return employees;
  }

  /**
   * Получить всех сотрудников, принадлежащих к группе responsibleOnWeekends
   * (включая сотрудников из подгруппы management и отдельных сотрудников с этой группой)
   */
  async getResponsibleOnWeekendsEmployees() {
    const responsibleGroups = this.getGroupsWithHierarchy(
      'responsibleOnWeekends'
    );

    // Ищем сотрудников, у которых хотя бы одна из групп совпадает с искомыми
    return await Employee.find({
      groups: { $in: responsibleGroups },
    }).sort('-createdAt');
  }

  /**
   * Получить всех сотрудников, принадлежащих к группе safetyOfficers
   * (включая все подгруппы: responsibleOnWeekends, management, oniot)
   */
  async getSafetyOfficersEmployees() {
    const safetyOfficersGroups = this.getGroupsWithHierarchy('safetyOfficers');

    // Ищем сотрудников, у которых хотя бы одна из групп совпадает с искомыми
    return await Employee.find({
      groups: { $in: safetyOfficersGroups },
    }).sort('-createdAt');
  }

  /**
   * Получить сотрудников по конкретной группе (без учета иерархии)
   * Полезно для администрирования через MongoDB Compass
   */
  async getEmployeesByGroup(groupName: string) {
    return await Employee.find({
      groups: groupName,
    }).sort('-createdAt');
  }

  /**
   * Добавить группу сотруднику
   */
  async addGroupToEmployee(employeeId: string, groupName: string) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return null;
    }

    // Если группа уже есть, не добавляем повторно
    if (!employee.groups?.includes(groupName)) {
      employee.groups = [...(employee.groups || []), groupName];
      await employee.save();
    }

    return employee;
  }

  /**
   * Удалить группу у сотрудника
   */
  async removeGroupFromEmployee(employeeId: string, groupName: string) {
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return null;
    }

    // Фильтруем массив групп, удаляя указанную группу
    if (employee.groups) {
      employee.groups = employee.groups.filter((group) => group !== groupName);
      await employee.save();
    }

    return employee;
  }

  
}

export const employeeService = new EmployeeService();
