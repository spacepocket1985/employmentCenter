import 'dotenv/config';

export type TOneCConfig = {
  // Общие настройки для всех сущностей 1С
  sourcePath: string;
  localPath: string;
  filesToCopy: string[];
  encoding: string;

  // Настройки для меню
  menuJournalId: string;
  menuMonthsToLoad: number;
  menuParseCron: string;
  menuParseCronFriday: string;

  // В будущем для кадров:
  // employeesJournalId: string;
  // employeesMonthsToLoad: number;
  // employeesParseCron: string;
  // employeesParseCronFriday: string;
};

function parseFileList(fileList: string | undefined): string[] {
  if (!fileList) {
    return [
      'SC3172.DBF',
      'SC3172.CDX',
      'DT4295.DBF',
      'DT4295.CDX',
      '1SJOURN.DBF',
      '1SJOURN.CDX',
    ];
  }
  return fileList.split(',').map((file) => file.trim());
}

export const oneCConfig: TOneCConfig = {
  // Общие настройки
  sourcePath: process.env.ONE_C_SOURCE_PATH || 'Y:/1C_OB',
  localPath: process.env.ONE_C_LOCAL_PATH || 'C:/temp/1C_OB',
  filesToCopy: parseFileList(process.env.ONE_C_FILES),
  encoding: process.env.ONE_C_ENCODING || 'cp1251',

  // Настройки для меню
  menuJournalId: process.env.ONE_C_MENU_JOURNAL_ID || '3BC',
  menuMonthsToLoad: parseInt(process.env.ONE_C_MENU_MONTHS_TO_LOAD || '2', 10),
  menuParseCron: process.env.ONE_C_MENU_PARSE_CRON || '0 6 * * *',
  menuParseCronFriday: process.env.ONE_C_MENU_PARSE_CRON_FRIDAY || '0 17 * * 5',
};

export default oneCConfig;