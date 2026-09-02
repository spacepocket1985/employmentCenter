/**
 * Тип для записи из DBF-файла (универсальный)
 */
export type TDbfRecord = Record<string, string | number | null>;

/** Тип для блюда из справочника "Изделия" (SC3172.DBF) */
export type TOneCDish = {
  ID: string;
  CODE: string;
  DESCR: string;
  SP3177: string; // Единица измерения
  SP3178: string; // Дополнительное свойство
};

/**
 * Тип для журнала документов (1SJOURN.DBF)
 * Содержит даты и информацию о документах
 */
export type TOneCJournal = {
  IDDOC: string; // Идентификатор документа
  DATE: Date | null; // Дата документа (уже как Date объект)
  ISMARK: string; // Метка удаления (пусто - активен, '1' - удален)
  DOCNO: string; // Номер документа
  IDJOURNAL: string; // ID журнала
};

/**
 * Тип для строки документа "ПланМеню" (DT4295.DBF)
 */
export type TOneCMenuItem = {
  IDDOC: string; // Ссылка на заголовок документа
  LINENO: string; // Номер строки в документе
  SP4301: string; // Наименование блюда (ID из SC3172)
  SP4302: string; // Выход блюда (вес/объем)
  SP4303: string; // Цена блюда
  SP4300: string; // Дата (Тдата)
};

/** Категория блюда для сортировки */
export type TDishCategory =
  | 'dairy' // Творог, молочные
  | 'drinks' // Напитки
  | 'soups' // Супы
  | 'sides' // Гарниры
  | 'salads' // Салаты
  | 'meat' // Мясо
  | 'fish' // Рыба
  | 'poultry' // Птица
  | 'baking' // Выпечка
  | 'desserts' // Десерты
  | 'other'; // Другое

/** Итоговый тип для позиции меню из 1С */

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
};

/** Тип для фильтрации меню по дате */
export type TMenuFilter = {
  dateFrom?: Date;
  dateTo?: Date;
  period?: 'week' | 'month' | 'custom';
  date?: string; // Конкретная дата
};

/** Тип для query-параметров запроса */
export type TMenuQueryParams = {
  period?: 'week' | 'month';
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
