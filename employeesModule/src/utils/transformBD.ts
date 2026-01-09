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

export const transformBD = (
  birthday: string
): {
  dateToText: string;
  isToday: boolean;
} => {
  const [, month, day] = birthday.split('-');

  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, Number(month) - 1, Number(day));

  const monthName = Months[Number(month) - 1];
  const weekdayName = Weekdays[date.getDay()];

  const isToday = Number(day) === new Date().getDate();
  const dateToText = `${Number(day)} ${monthName}, ${weekdayName}${
    isToday ? ', сегодня.' : '.'
  }`;

  return {
    dateToText,
    isToday,
  };
};
