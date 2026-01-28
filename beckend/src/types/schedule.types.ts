import { ObjectId } from 'mongoose';

export type ScheduleType = {
  _id: ObjectId;
  month: string; // Формат: "2024-01" (год-месяц)
  scheduleType: 'responsibleOnWeekends' | 'safetyOfficers'; // Тип графика
  entries: ScheduleEntry[]; // Записи графика
  createdAt: Date;
  updatedAt: Date;
  createdBy?: ObjectId; // Кто создал (если нужна авторизация)
  isPublished: boolean; // Опубликован ли график
  notes?: string; // Примечания к графику
};

export type ScheduleEntry = {
  _id?: ObjectId;
  employeeId?: ObjectId; // Ссылка на сотрудника (если выбран из базы)
  customName?: string; // Ручной ввод имени (если не из базы)
  customJob?: string; // Ручной ввод должности (если не из базы)
  dates: string[]; // Даты в формате "2024-01-06"
  orderIndex: number; // Порядок в графике
  notes?: string; // Примечания к конкретной записи
};
