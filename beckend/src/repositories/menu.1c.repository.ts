import path from "path";
import { DBFFile } from "dbffile";

import oneCConfig from "../config/oneC.config";
import { DateUtils } from "../utils/dateUtils";
import { readDbfFile } from "../utils/dbfReader";
import {
  TOneCDish,
  TDbfRecord,
  TOneCJournal,
  TOneCMenuItem,
} from "../types/oneC.types";

export class MenuOneCRepository {
  /**
   * Получить все блюда из справочника SC3172.DBF
   *
   * Фильтрация:
   * - ISFOLDER === '2' — только блюда (не папки)
   * - ISMARK !== '*' — только активные (не удалённые)
   *
   * Возвращает поля для категоризации:
   * - PARENTID — ID родительской папки
   * - SP4618 — код подкатегории
   */
  async getAllDishes(): Promise<TOneCDish[]> {
    const filePath = path.join(oneCConfig.localPath, "SC3172.DBF");
    const records = await readDbfFile(filePath, oneCConfig.encoding);

    const dishes: TOneCDish[] = [];

    for (const record of records) {
      const isFolder = String(record.ISFOLDER || "").trim();
      const isMark = String(record.ISMARK || "").trim();

      // Пропускаем папки
      if (isFolder === "1") continue;

      // Пропускаем удалённые
      if (isMark === "*") continue;

      dishes.push({
        ID: String(record.ID || "").trim(),
        CODE: String(record.CODE || "").trim(),
        DESCR: String(record.DESCR || "").trim(),
        SP3177: String(record.SP3177 || "").trim(),
        PARENTID: String(record.PARENTID || "").trim(),
        SP4618: String(record.SP4618 || "").trim(),
        ISFOLDER: isFolder,
        ISMARK: isMark,
      });
    }

    return dishes;
  }

  /**
   * Получить записи из журнала документов 1SJOURN.DBF
   */
  async getJournal(dateFrom?: Date): Promise<TOneCJournal[]> {
    const filePath = path.join(oneCConfig.localPath, "1SJOURN.DBF");

    const dbf = await DBFFile.open(filePath, { encoding: oneCConfig.encoding });
    const records = await dbf.readRecords(dbf.recordCount);

    const result: TOneCJournal[] = [];

    for (const record of records) {
      const dateValue = record.DATE;
      let parsedDate: Date | null = null;

      if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
        parsedDate = dateValue;
      } else if (typeof dateValue === "string") {
        parsedDate = DateUtils.parseDateFrom1C(dateValue);
      } else if (typeof dateValue === "number") {
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
        IDDOC: String(record.IDDOC || "").trim(),
        DATE: parsedDate,
        ISMARK: String(record.ISMARK || "").trim(),
        DOCNO: String(record.DOCNO || "").trim(),
        IDJOURNAL: String(record.IDJOURNAL || "").trim(),
      });
    }

    return result;
  }

  /**
   * Получить позиции меню из DT4295.DBF
   */
  async getMenuItems(): Promise<TOneCMenuItem[]> {
    const filePath = path.join(oneCConfig.localPath, "DT4295.DBF");
    const records = await readDbfFile(filePath, oneCConfig.encoding);

    return records.map((record: TDbfRecord) => ({
      IDDOC: String(record.IDDOC || "").trim(),
      LINENO: String(record.LINENO || "").trim(),
      SP4301: String(record.SP4301 || "").trim(),
      SP4302: String(record.SP4302 || "").trim(),
      SP4303: String(record.SP4303 || "").trim(),
      SP4300: String(record.SP4300 || "").trim(),
    }));
  }
}

export const menuOneCRepository = new MenuOneCRepository();
