import path from 'path';
import { DBFFile } from 'dbffile';

import oneCConfig from '../config/oneC.config';
import { DateUtils } from '../utils/dateUtils';
import { readDbfFile } from '../utils/dbfReader';
import {
  TOneCDish,
  TDbfRecord,
  TOneCJournal,
  TOneCMenuItem,
} from '../types/oneC.types';

export class MenuOneCRepository {
  async getAllDishes(): Promise<TOneCDish[]> {
    const filePath = path.join(oneCConfig.localPath, 'SC3172.DBF');
    const records = await readDbfFile(filePath, oneCConfig.encoding);

    return records.map((record: TDbfRecord) => ({
      ID: String(record.ID || '').trim(),
      CODE: String(record.CODE || '').trim(),
      DESCR: String(record.DESCR || '').trim(),
      SP3177: String(record.SP3177 || '').trim(),
      SP3178: String(record.SP3178 || '').trim(),
    }));
  }

  async getJournal(dateFrom?: Date): Promise<TOneCJournal[]> {
    const filePath = path.join(oneCConfig.localPath, '1SJOURN.DBF');

    const dbf = await DBFFile.open(filePath, { encoding: oneCConfig.encoding });
    const records = await dbf.readRecords(dbf.recordCount);

    const result: TOneCJournal[] = [];

    for (const record of records) {
      const dateValue = record.DATE;
      let parsedDate: Date | null = null;

      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        parsedDate = dateValue;
      } else if (typeof dateValue === 'string') {
        parsedDate = DateUtils.parseDateFrom1C(dateValue);
      } else if (typeof dateValue === 'number') {
        const date = new Date(dateValue);
        if (DateUtils.isValidDate(date)) {
          parsedDate = date;
        }
      }

      if (dateFrom && parsedDate) {
        const compareDate = new Date(dateFrom);
        compareDate.setHours(0, 0, 0, 0);
        if (parsedDate < compareDate) {
          continue;
        }
      }

      result.push({
        IDDOC: String(record.IDDOC || '').trim(),
        DATE: parsedDate,
        ISMARK: String(record.ISMARK || '').trim(),
        DOCNO: String(record.DOCNO || '').trim(),
        IDJOURNAL: String(record.IDJOURNAL || '').trim(),
      });
    }

    return result;
  }

  async getMenuItems(): Promise<TOneCMenuItem[]> {
    const filePath = path.join(oneCConfig.localPath, 'DT4295.DBF');
    const records = await readDbfFile(filePath, oneCConfig.encoding);

    return records.map((record: TDbfRecord) => ({
      IDDOC: String(record.IDDOC || '').trim(),
      LINENO: String(record.LINENO || '').trim(),
      SP4301: String(record.SP4301 || '').trim(),
      SP4302: String(record.SP4302 || '').trim(),
      SP4303: String(record.SP4303 || '').trim(),
      SP4300: String(record.SP4300 || '').trim(),
    }));
  }
}

export const menuOneCRepository = new MenuOneCRepository();
