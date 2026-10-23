// Service level (Business Logic Layer):
// Description: Implements the logic for working with data.

import { Employee, EmployeeType } from '../models/employee.model';
import { EmployeeCreateModel } from '../models/employeeCreateModel';
import { EmployeeBirthdayView } from '../models/employeeViewModel';

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
   * Сортировка по responsibleOrder, затем по имени
   */
  async getResponsibleOnWeekendsEmployees() {
    const responsibleGroups = this.getGroupsWithHierarchy(
      'responsibleOnWeekends'
    );

    // Ищем сотрудников, у которых хотя бы одна из групп совпадает с искомыми
    // Сортировка: сначала по responsibleOrder (по возрастанию), затем по имени
    return await Employee.find({
      groups: { $in: responsibleGroups },
    }).sort({
      responsibleOrder: 1, // Сначала по порядку для ответственных
      name: 1, // Затем по имени (для одинакового порядка)
    });
  }

  /**
   * Получить всех сотрудников, принадлежащих к группе safetyOfficers
   * (включая все подгруппы: responsibleOnWeekends, management, oniot)
   * Сортировка по safetyOrder, затем по имени
   */
  async getSafetyOfficersEmployees() {
    const safetyOfficersGroups = this.getGroupsWithHierarchy('safetyOfficers');

    // Ищем сотрудников, у которых хотя бы одна из групп совпадает с искомыми
    // Сортировка: сначала по safetyOrder (по возрастанию), затем по имени
    return await Employee.find({
      groups: { $in: safetyOfficersGroups },
    }).sort({
      safetyOrder: 1, // Сначала по порядку для безопасности
      name: 1, // Затем по имени (для одинакового порядка)
    });
  }

  /**
   * Получить сотрудников по конкретной группе (без учета иерархии)
   * Полезно для администрирования через MongoDB Compass
   */
  async getEmployeesByGroup(groupName: string) {
    return await Employee.find({
      groups: groupName,
    }).sort({ orderIndex: 1, name: 1 });
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

  // ============================================
  // НОВЫЙ МЕТОД: Получение списка мастеров
  // ============================================

  /**
   * Получить всех сотрудников с должностью "мастер"
   * Поиск регистронезависимый, ищет вхождение "мастер" в поле job
   * Сортировка по подразделению, затем по имени
   * @returns Promise с массивом сотрудников-мастеров
   */
  async getMasters(): Promise<EmployeeType[]> {
    // Регистронезависимый поиск по вхождению "мастер" в поле job
    const regex = new RegExp('мастер', 'i');

    return await Employee.find({
      job: { $regex: regex },
    }).sort({
      department: 1, // Сначала по подразделению
      name: 1, // Затем по имени
    });
  }

  // ============================================
  // [НОВОЕ] Модуль дней рождения — полный список
  // Существующие методы выше НЕ затронуты
  // ============================================

  /**
   * [НОВОЕ] Получить список уникальных отделов для фильтра.
   * Отфильтровывает пустые и null-значения, сортирует по алфавиту (ru).
   */
  async getDepartments(): Promise<string[]> {
    const departments = await Employee.distinct('department');
    return departments
      .filter((d): d is string => typeof d === 'string' && d.trim() !== '')
      .sort((a, b) => a.localeCompare(b, 'ru'));
  }

  /**
   * [НОВОЕ] Получить полный список дней рождения с фильтрацией.
   * Формат birthday в БД: "YYYY-MM-DD" (подтверждено по JSON).
   *
   * @param filters.month      - номер месяца 1..12 (строка)
   * @param filters.department - точное название отдела
   * @param filters.search     - подстрока ФИО (регистронезависимо)
   * @returns Promise<EmployeeBirthdayView[]> — сотрудники, отсортированные
   *          по MM-DD, затем по имени, с флагами isToday/isSoon
   */
  async getAllBirthdays(filters: {
    month?: string;
    department?: string;
    search?: string;
  }): Promise<EmployeeBirthdayView[]> {
    const query: Record<string, unknown> = {};

    if (filters.search && filters.search.trim() !== '') {
      query.name = { $regex: filters.search.trim(), $options: 'i' };
    }

    if (filters.department && filters.department.trim() !== '') {
      query.department = filters.department.trim();
    }

    if (filters.month && filters.month.trim() !== '') {
      const monthNum = parseInt(filters.month, 10);
      if (monthNum >= 1 && monthNum <= 12) {
        const monthStr = monthNum.toString().padStart(2, '0');
        // birthday = "YYYY-MM-DD" → ищем вхождение "-MM-"
        query.birthday = { $regex: `-${monthStr}-` };
      }
    }

    const employees = await Employee.find(query);

    // Сортировка: сначала по MM-DD, затем по имени
    employees.sort((a, b) => {
      const aMMDD = a.birthday.substring(5);
      const bMMDD = b.birthday.substring(5);
      const cmp = aMMDD.localeCompare(bMMDD);
      return cmp !== 0 ? cmp : a.name.localeCompare(b.name, 'ru');
    });

    return this.enrichWithBirthdayStatus(employees);
  }

  /**
   * [НОВОЕ, private] Обогащает сотрудников флагами isToday/isSoon.
   * "Скоро" = сегодня, завтра, послезавтра (окно 3 дня).
   * Не зависит от getHBEmployees (у него своя логика).
   */
  private enrichWithBirthdayStatus(
    employees: EmployeeType[]
  ): EmployeeBirthdayView[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMD = this.getMonthDay(today);
    const tomorrowMD = this.getMonthDay(
      new Date(today.getTime() + 24 * 60 * 60 * 1000)
    );
    const dayAfterMD = this.getMonthDay(
      new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    );

    return employees.map((emp) => {
      const empMD = emp.birthday.substring(5);
      const isToday = empMD === todayMD;
      const isSoon = isToday || empMD === tomorrowMD || empMD === dayAfterMD;

      // Приводим Mongoose-документ к plain-объекту без any
      const plain = JSON.parse(JSON.stringify(emp)) as EmployeeType;
      return { ...plain, isToday, isSoon };
    });
  }

  /**
   * [НОВОЕ, private] Возвращает строку "MM-DD" для переданной даты.
   * Не конфликтует с существующим formatDate (тот отдаёт "YYYY-MM-DD").
   */
  private getMonthDay(date: Date): string {
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    return `${mm}-${dd}`;
  }
}

export const employeeService = new EmployeeService();