const Months = [
  'января',
  'февраль',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const Weekdays = [
  'воскресенье',
  'понедельник',
  'вторник',
  'среда',
  'четверг',
  'пятница',
  'суббота',
];

/**
 * Форматирует строку "YYYY-MM-DD" в читаемый текст и вычисляет флаги ДР.
 *
 * @param birthday - дата в формате "YYYY-MM-DD" (например, "1982-10-25")
 * @returns
 *  - dateToText: "25 октября, пятница." (или "...сегодня." если ДР сегодня)
 *  - isToday:    true, если день рождения сегодня (сравнение по MM-DD)
 *  - isSoon:     true, если ДР сегодня, завтра или послезавтра
 */
export const transformBD = (
  birthday: string
): {
  dateToText: string;
  isToday: boolean;
  isSoon: boolean;
} => {
  const [, month, day] = birthday.split('-');

  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, Number(month) - 1, Number(day));

  const monthName = Months[Number(month) - 1];
  const weekdayName = Weekdays[date.getDay()];

  // [ФИКС] Сравниваем MM-DD, а не только день месяца.
  // Раньше: Number(day) === new Date().getDate() — ложные срабатывания
  // в другие месяцы с тем же числом.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMD = getMonthDay(today);
  const birthdayMD = `${month}-${day}`;
  const isToday = birthdayMD === todayMD;

  const dateToText = `${Number(day)} ${monthName}, ${weekdayName}${
    isToday ? ', сегодня.' : '.'
  }`;

  // isSoon: ДР сегодня, завтра или послезавтра.
  // Считаем через Date, чтобы корректно обрабатывать переход через конец месяца.
  const isSoon = isBirthdaySoon(birthday);

  return {
    dateToText,
    isToday,
    isSoon,
  };
};

/**
 * [internal] Проверяет, попадает ли ДР в окно "сегодня / завтра / послезавтра".
 * Сравниваем только MM-DD, год игнорируется.
 *
 * @param birthday - дата в формате "YYYY-MM-DD"
 * @returns true, если ДР сегодня, завтра или послезавтра
 */
const isBirthdaySoon = (birthday: string): boolean => {
  const [, month, day] = birthday.split('-');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMD = getMonthDay(today);
  const tomorrowMD = getMonthDay(
    new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );
  const dayAfterMD = getMonthDay(
    new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
  );

  const birthdayMD = `${month}-${day}`;
  return (
    birthdayMD === todayMD ||
    birthdayMD === tomorrowMD ||
    birthdayMD === dayAfterMD
  );
};

/**
 * [internal] Возвращает "MM-DD" для переданной даты.
 * Используется для сравнения дней рождения без учёта года.
 */
const getMonthDay = (date: Date): string => {
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');
  return `${mm}-${dd}`;
};
