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
    <TableRow sx={{ bgcolor: '#103896' }}>
      <TableCell colSpan={4} sx={{ py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <CalendarTodayIcon sx={{ color: '#103896' }} />
          <Typography
            variant="body1"
            sx={{
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            {weekNumber} неделя  ({startDate} - {endDate})
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default WeekSeparator;
