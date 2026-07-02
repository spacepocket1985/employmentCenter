export function formatDateWithoutSeconds(dateString: string): string {
  // Создаем объект Date из строки
  const date = new Date(dateString);

  // Проверяем, валидная ли дата
  if (isNaN(date.getTime())) {
    throw new Error('Неверный формат даты');
  }

  // Получаем компоненты даты
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 потому что месяцы с 0
  const year = date.getFullYear();

  // Получаем компоненты времени
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  // Возвращаем в формате "дд.мм.гггг чч:мм"
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
