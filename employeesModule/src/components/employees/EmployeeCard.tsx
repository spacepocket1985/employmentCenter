import React from 'react';
import { Stack, Typography } from '@mui/material';

import { transformBD } from '../../utils/transformBD';
import { EmployeeType } from '../../types/employee.types';

/**
 * Универсальная карточка сотрудника.
 * Используется и в виджете /hb, и в модалке «Все дни рождения».
 *
 * Флаги isToday/isSoon приходят пропсами:
 *  - виджет /hb  → вычисляет через transformBD
 *  - модалка     → берёт из ответа бэкенда (employee.isToday / employee.isSoon)
 *
 * Цвета:
 *  - isToday           → зелёный фон (#e8f5e9) + тёмно-зелёный текст (#2e7d32)
 *  - isSoon && !isToday → жёлтый фон (#fff8e1) + тёмно-оранжевый текст (#e65100)
 *  - иначе             → без фона + серый текст (#444444)
 */
export const EmployeeCard: React.FC<{
  employee: EmployeeType;
  isToday: boolean;
  isSoon: boolean;
}> = React.memo(({ employee, isToday, isSoon }) => {
  const { dateToText } = transformBD(employee.birthday);

  const nameColor: string = isToday
    ? '#2e7d32' // тёмно-зелёный
    : isSoon
    ? '#e65100' // тёмно-оранжевый
    : '#444444';

  const backgroundColor: string | undefined = isToday
    ? '#e8f5e9' // светло-зелёный
    : isSoon
    ? '#fff8e1' // светло-жёлтый
    : undefined;

  return (
    <Stack sx={{ p: 1, backgroundColor, borderRadius: 1 }}>
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
