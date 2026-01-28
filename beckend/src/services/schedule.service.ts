// Service level для графиков

import { Schedule } from '../models/schedule.model';
import { ScheduleCreateModel } from '../models/scheduleCreateModel';
import { ScheduleUpdateModel } from '../models/scheduleUpdateModel';
import { ScheduleType, ScheduleEntry } from '../types/schedule.types';
import { employeeService } from './employee.service';

class ScheduleService {
  /**
   * Создать новый график
   */
  async createSchedule(
    scheduleData: ScheduleCreateModel
  ): Promise<ScheduleType> {
    // Проверяем, что все записи имеют orderIndex
    const entriesWithOrder = scheduleData.entries.map((entry, index) => ({
      ...entry,
      orderIndex: entry.orderIndex ?? index,
    }));

    const schedule = new Schedule({
      ...scheduleData,
      entries: entriesWithOrder,
    });

    return await schedule.save();
  }

  /**
   * Получить графики с фильтрацией
   */
  async getSchedules(filters: {
    month?: string;
    scheduleType?: string;
  }): Promise<ScheduleType[]> {
    const query: { month?: string; scheduleType?: string } = {};

    if (filters.month) {
      query.month = filters.month;
    }

    if (filters.scheduleType) {
      query.scheduleType = filters.scheduleType;
    }

    return await Schedule.find(query)
      .sort({ month: -1, scheduleType: 1 })
      .populate('entries.employeeId', 'name job department')
      .exec();
  }

  /**
   * Получить график по ID
   */
  async getSchedule(id: string): Promise<ScheduleType | null> {
    return await Schedule.findById(id)
      .populate('entries.employeeId', 'name job department')
      .exec();
  }

  /**
   * Получить график по месяцу и типу
   */
  async getScheduleByMonthAndType(
    month: string,
    scheduleType: 'responsibleOnWeekends' | 'safetyOfficers'
  ): Promise<ScheduleType | null> {
    return await Schedule.findOne({ month, scheduleType })
      .populate('entries.employeeId', 'name job department')
      .exec();
  }

  /**
   * Обновить график
   */
  async updateSchedule(
    id: string,
    updateData: ScheduleUpdateModel
  ): Promise<ScheduleType | null> {
    // Если обновляем entries, убедимся что есть orderIndex
    const updateObject: Partial<ScheduleType> = { ...updateData };

    if (updateData.entries) {
      const entriesWithOrder = updateData.entries.map((entry, index) => ({
        ...entry,
        orderIndex: entry.orderIndex ?? index,
      }));
      updateObject.entries = entriesWithOrder as ScheduleEntry[];
    }

    return await Schedule.findByIdAndUpdate(id, updateObject, {
      new: true,
      runValidators: true,
    })
      .populate('entries.employeeId', 'name job department')
      .exec();
  }

  /**
   * Удалить график
   */
  async deleteSchedule(id: string): Promise<ScheduleType | null> {
    return await Schedule.findByIdAndDelete(id)
      .populate('entries.employeeId', 'name job department')
      .exec();
  }

  /**
   * Создать график на основе шаблона (автозаполнение из сотрудников)
   */
  async createScheduleFromTemplate(
    month: string,
    scheduleType: 'responsibleOnWeekends' | 'safetyOfficers'
  ): Promise<ScheduleType> {
    // Проверяем, не существует ли уже график
    const existingSchedule = await Schedule.findOne({ month, scheduleType });
    if (existingSchedule) {
      throw new Error(`Schedule for ${month} (${scheduleType}) already exists`);
    }

    // Получаем сотрудников в зависимости от типа графика
    let employees;
    if (scheduleType === 'responsibleOnWeekends') {
      employees = await employeeService.getResponsibleOnWeekendsEmployees();
    } else {
      employees = await employeeService.getSafetyOfficersEmployees();
    }

    if (!employees || employees.length === 0) {
      throw new Error(`No employees found for ${scheduleType}`);
    }

    // Создаем записи графика на основе сотрудников
    const entries: Omit<ScheduleEntry, '_id'>[] = employees.map(
      (employee, index) => ({
        employeeId: employee._id,
        customName: '',
        customJob: '',
        dates: [], // Даты заполняются вручную
        orderIndex: index,
        notes: '',
      })
    );

    // Создаем график
    const schedule = new Schedule({
      month,
      scheduleType,
      entries,
      isPublished: false,
    });

    return await schedule.save();
  }

  /**
   * Получить последний опубликованный график указанного типа
   */
  async getLastPublishedSchedule(
    scheduleType: 'responsibleOnWeekends' | 'safetyOfficers'
  ): Promise<ScheduleType | null> {
    return await Schedule.findOne({ scheduleType, isPublished: true })
      .sort({ month: -1 })
      .populate('entries.employeeId', 'name job department')
      .exec();
  }
}

export const scheduleService = new ScheduleService();
