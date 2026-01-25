import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { DayPlan } from 'src/types/plan.types';
import {
  PRINT_ROW_STYLES,
  PRINT_CELL_STYLES,
  PRINT_TEXT_STYLES,
  PRINT_ICON_STYLES,
} from 'src/const/printStyles';

interface SpecialDayRowProps {
  day: DayPlan;
}

const SpecialDayRow: React.FC<SpecialDayRowProps> = ({ day }) => {
  return (
    <TableRow
      sx={{
        bgcolor: '#fff3e0',
        borderBottom: '1px solid #ffcc80',
        '&:hover': {
          bgcolor: '#ffe0b2',
        },
        '@media print': PRINT_ROW_STYLES,
      }}
    >
      {/* Ячейка даты */}
      <TableCell
        sx={{
          verticalAlign: 'center',
          borderRight: '1px solid #ffcc80',
          bgcolor: '#ff9800',
          borderBottom: '1px solid #ffcc80',
          width: '15%',
          '@media print': PRINT_CELL_STYLES,
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CelebrationIcon
            sx={{
              color: 'white',
              mb: 0.5,
              '@media print': PRINT_ICON_STYLES,
            }}
          />
          <Typography
            variant="h6"
            fontWeight={600}
            color="white"
            fontSize="1.5rem"
            sx={{
              '@media print': PRINT_TEXT_STYLES,
            }}
          >
            {day.dayNumber}
          </Typography>
          <Typography
            variant="body2"
            color="white"
            fontSize="0.9rem"
            sx={{
              textTransform: 'capitalize',
              '@media print': PRINT_TEXT_STYLES,
            }}
          >
            {day.dayOfWeek}
          </Typography>
        </Box>
      </TableCell>

      {/* Объединенные колонки */}
      <TableCell
        colSpan={3}
        sx={{
          verticalAlign: 'middle',
          textAlign: 'center',
          py: 2,
          '@media print': PRINT_CELL_STYLES,
        }}
      >
        <Typography
          variant="h6"
          color="#e65100"
          fontWeight={600}
          sx={{
            fontSize: '1.1rem',
            '@media print': PRINT_TEXT_STYLES,
          }}
        >
          {day.specialDayTitle || 'Специальный день'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default SpecialDayRow;
