import React from 'react';
import { Stack, Typography } from '@mui/material';

import { transformBD } from '../../utils/transformBD';
import { EmployeeBirthdayType } from '../../types/employee.types';

/**
 * Карточка сотрудника для модалки «Все дни рождения».
 * Отличается от Employee.tsx двухуровневой подсветкой:
 *  - isToday  → зелёный
 *  - isSoon (и не сегодня) → жёлтый
 *  - остальные → нейтральный
 *
 * Флаги isToday/isSoon берём с бэкенда (employee.isToday / employee.isSoon),
 * а transformBD используем только для форматирования даты в текст.
 */
export const EmployeeBirthdayCard: React.FC<{
  employee: EmployeeBirthdayType;
}> = React.memo(({ employee }) => {
  const { dateToText } = transformBD(employee.birthday);

  const { isToday, isSoon } = employee;

  // Цвет текста ФИО
  const nameColor: string = isToday
    ? '#2e7d32' // тёмно-зелёный
    : isSoon
    ? '#e65100' // тёмно-оранжевый
    : '#444444';

  // Фон карточки (лёгкий оттенок)
  const backgroundColor: string | undefined = isToday
    ? '#e8f5e9' // светло-зелёный
    : isSoon
    ? '#fff8e1' // светло-жёлтый
    : undefined; // нейтральный — наследуется от родителя

  return (
    <Stack
      sx={{
        p: 1,
        backgroundColor,
        borderRadius: 1,
      }}
    >
      <Typography variant="caption" sx={{ fontWeight: '600' }}>
        {dateToText}
      </Typography>
      <Typography
        textAlign={'left'}
        variant="subtitle2"
        sx={{ color: nameColor }}
      >
        <span style={{ fontWeight: 'bold' }}>{employee.name}</span>,{' '}
        {employee.job}, {employee.department}.
      </Typography>
    </Stack>
  );
});
