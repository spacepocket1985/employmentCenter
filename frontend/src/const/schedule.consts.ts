import { ScheduleType } from 'src/types/schedule.types';

export const scheduleListCellTitles = [
  'Месяц и год',
  'Вид графика',
  'Число отвественных',
  'Кол-во дней',
  'Действия',
];

export const scheduleCellTitles = [
  '№ п/п',
  'Ф.И.О.',
  'Должность',
  'Подразделение',
  'Дни',
];

export const SCHEDULE_TITLES: Record<
  ScheduleType,
  {
    shortTitle: string;
    fullTitle: string;
  }
> = {
  responsibleOnWeekends: {
    shortTitle: 'ГРАФИК дежурств',
    fullTitle: 'ГРАФИК дежурств ответственных в выходные дни',
  },
  safetyOfficers: {
    shortTitle: 'ГРАФИК проведения проверок',
    fullTitle:
      'ГРАФИК проведения проверок ответственными лицами охраны труда, технологической дисциплины, безопасной и экономичной эксплуатации оборудования, выполнения Директивы № 1',
  },
} as const;
