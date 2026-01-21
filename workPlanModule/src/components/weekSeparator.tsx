import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface WeekSeparatorProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
}

const WeekSeparator: React.FC<WeekSeparatorProps> = ({
  weekNumber,
  startDate,
  endDate,
}) => {
  return (
    <TableRow sx={{ bgcolor: 'rgb(231, 241, 255)' }}>
      <TableCell colSpan={4} sx={{ py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <CalendarTodayIcon sx={{ color: 'rgb(16, 56, 150)' }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: 'rgb(16, 56, 150)',
            }}
          >
            Неделя {weekNumber} ({startDate} - {endDate})
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default WeekSeparator;
