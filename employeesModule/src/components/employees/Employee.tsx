import React from 'react';
import { Stack, Typography } from '@mui/material';
import { EmployeeType } from '../../types/types';
import { transformBD } from '../../utils/transformBD';

export const Employee: React.FC<{ employee: EmployeeType }> = React.memo(
  ({ employee }) => {
    const { isToday, dateToText } = transformBD(employee.birthday);
    return (
      <Stack sx={{ p: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: '600' }}>
          {dateToText}
        </Typography>
        <Typography
          textAlign={'left'}
          variant="subtitle2"
          sx={{ color: isToday ? '#103896' : '#444444' }}
        >
          <span style={{ fontWeight: 'bold' }}>{employee.name}</span>,{' '}
          {employee.job}, {employee.department}.
        </Typography>
      </Stack>
    );
  }
);
