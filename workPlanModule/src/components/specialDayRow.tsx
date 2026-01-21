import React from 'react';
import { TableRow, TableCell, Typography } from '@mui/material';
import { DayPlan } from 'src/types/plan.types';

interface SpecialDayRowProps {
  day: DayPlan;
}

const SpecialDayRow: React.FC<SpecialDayRowProps> = ({ day }) => {
  return (
    <TableRow sx={{ bgcolor: 'warning.light' }}>
      {/* Ячейка даты */}
      <TableCell
        sx={{
          verticalAlign: 'center',
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'warning.main',
        }}
      >
        <Typography
          variant="body1"
          fontWeight="bold"
          color="white"
          fontSize="1.5rem"
          align="center"
        >
          {day.dayNumber}
        </Typography>
        <Typography
          variant="body2"
          color="white"
          fontSize="1rem"
          align="center"
        >
          {day.dayOfWeek}
        </Typography>
      </TableCell>

      {/* Объединенные колонки для названия специального дня */}
      <TableCell
        colSpan={3}
        sx={{
          verticalAlign: 'middle',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="body1"
          color="white"
          fontWeight="bold"
          sx={{
            textTransform: 'uppercase',
            fontSize: '1.1rem',
          }}
        >
          {day.specialDayTitle || 'Специальный день'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default SpecialDayRow;
