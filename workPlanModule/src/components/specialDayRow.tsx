import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { DayPlan } from 'src/types/plan.types';

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
          bgcolor: '#ffe0b2'
        }
      }}
    >
      {/* Ячейка даты */}
      <TableCell
        sx={{
          verticalAlign: 'center',
          borderRight: '1px solid #ffcc80',
          bgcolor: '#ff9800',
          borderBottom: '1px solid #ffcc80',
          width: '15%'
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <CelebrationIcon sx={{ color: 'white', mb: 0.5 }} />
          <Typography
            variant="h6"
            fontWeight={600}
            color="white"
            fontSize="1.5rem"
          >
            {day.dayNumber}
          </Typography>
          <Typography
            variant="body2"
            color="white"
            fontSize="0.9rem"
            sx={{ textTransform: 'capitalize' }}
          >
            {day.dayOfWeek}
          </Typography>
        </Box>
      </TableCell>

      {/* Объединенные колонки для названия специального дня */}
      <TableCell
        colSpan={3}
        sx={{
          verticalAlign: 'middle',
          textAlign: 'center',
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          color="#e65100"
          fontWeight={600}
          sx={{
            fontSize: '1.1rem'
          }}
        >
          {day.specialDayTitle || 'Специальный день'}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

export default SpecialDayRow;