/**
 * Тип для записи из DBF-файла (универсальный)
 */
export type TDbfRecord = Record<string, string | number | null>;

/**
 * Тип для блюда из справочника "Изделия" (SC3172.DBF)
 *
 * Поля:
 * - ID, CODE, DESCR — идентификатор, код, название
 * - SP3177 — единица измерения (1=шт, 2=кг, 4=порция)
 * - PARENTID — ID родительской папки в справочнике 1С
 * - SP4618 — код подкатегории (детальная категоризация)
 * - ISFOLDER — признак папки (1 = папка, 2 = блюдо)
 * - ISMARK — метка удаления (пусто = активен, '*' = удален)
 */
export type TOneCDish = {
  ID: string;
  CODE: string;
  DESCR: string;
  SP3177: string; // Единица измерения
  PARENTID: string; // ID родительской папки
  SP4618: string; // Код подкатегории
  ISFOLDER: string; // Признак папки
  ISMARK: string; // Метка удаления
};

/**
 * Тип для журнала документов (1SJOURN.DBF)
 * Содержит даты и информацию о документах
 */
export type TOneCJournal = {
  IDDOC: string; // Идентификатор документа
  DATE: Date | null; // Дата документа
  ISMARK: string; // Метка удаления
  DOCNO: string; // Номер документа
  IDJOURNAL: string; // ID журнала
};

/**
 * Тип для строки документа "ПланМеню" (DT4295.DBF)
 */
export type TOneCMenuItem = {
  IDDOC: string;
  LINENO: string;
  SP4301: string;
  SP4302: string;
  SP4303: string;
  SP4300: string;
};

// ========== КАТЕГОРИИ ==========
export type TDishCategory =
  | "dairy"
  | "drinks"
  | "soups"
  | "sides"
  | "salads"
  | "meat"
  | "fish"
  | "poultry"
  | "culinary"
  | "other";

/**
 * Итоговый тип для позиции меню из 1С
 */
export type TOneCMenuItemResult = {
  id: string;
  name: string;
  code: string;
  price: number;
  output: string;
  unit: string;
  docDate?: string;
  docNumber?: string;
  itemDate?: string;
  category?: TDishCategory;
  categoryOrder?: number;
  /** ID родительской папки из справочника 1С */
  parentId?: string;
  /** Код подкатегории из 1С */
  sp4618?: string;
};

/** Тип для фильтрации меню по дате */
export type TMenuFilter = {
  dateFrom?: Date;
  dateTo?: Date;
  period?: "week" | "month" | "custom";
  date?: string;
};

/** Тип для query-параметров запроса */
export type TMenuQueryParams = {
  period?: "week" | "month";
  dateFrom?: string;
  dateTo?: string;
};

/** Тип для ответа с меню из 1С */
export type TOneCMenuResponse = {
  items: TOneCMenuItemResult[];
  count: number;
  filter?: {
    period?: string;
    dateFrom?: string;
    dateTo?: string;
  };
};

/** Тип для стандартного API-ответа */
export type TApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};
