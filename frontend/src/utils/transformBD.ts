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

export const transformBD = (birthday: string): string => {
  const [, month, day] = birthday.split('-');
  return `${day} ${Months[Number(month)]}`;
};

export const cutBDdate = (birthday: string): string => birthday.split('T')[0];
