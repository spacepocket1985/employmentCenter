/**
 * Парсит дату в формате DD.MM.YY в объект Date
 * @param dateStr - строка даты в формате "DD.MM.YY"
 * @returns объект Date
 */
export const parseDateDMY = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('.');
  // Добавляем 2000 к году (так как год двузначный)
  return new Date(2000 + parseInt(year), parseInt(month) - 1, parseInt(day));
};

/**
 * Форматирует дату в формате DD.MM.YY
 * @param date - объект Date
 * @returns строка в формате "DD.MM.YY"
 */
export const formatDateToDMY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

/**
 * Сортирует массив объектов по дате (поле date в формате DD.MM.YY)
 * @param items - массив объектов с полем date
 * @returns отсортированный массив (создает новую копию)
 */
export const sortByDate = <T extends { date: string }>(items: T[]): T[] => {
  return [...items].sort((a, b) => {
    return parseDateDMY(a.date).getTime() - parseDateDMY(b.date).getTime();
  });
};

/**
 * Проверяет, является ли дата сегодняшней
 * @param dateStr - строка даты в формате "DD.MM.YY"
 * @returns true если дата сегодня
 */
export const isDateToday = (dateStr: string): boolean => {
  const today = new Date();
  const date = parseDateDMY(dateStr);

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Проверяет, есть ли сегодняшняя дата в массиве
 * @param items - массив объектов с полем date
 * @returns true если есть сегодняшняя дата
 */
export const hasTodayInArray = <T extends { date: string }>(
  items: T[]
): boolean => {
  return items.some((item) => isDateToday(item.date));
};
