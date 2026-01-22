import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';

interface WeekSeparatorProps {
  weekNumber: number;
  startDate: string;
  endDate: string;
  monthName: string;
}

const WeekSeparator: React.FC<WeekSeparatorProps> = ({
  weekNumber,
  startDate,
  endDate,
  monthName,
}) => {
  return (
    <TableRow sx={{ bgcolor: '#f0f4f8' }}>
      <TableCell
        colSpan={4}
        sx={{ py: 1.5, borderBottom: '2px solid #3a506b' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              backgroundColor: '#2c3e50',
              color: '#fff',
              p: 1,
              borderRadius: 2,
            }}
          >
            {weekNumber} неделя {monthName}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              backgroundColor: '#2c3e50',
              color: '#fff',
              p: 1,
              borderRadius: 2,
            }}
          >
            ({startDate} - {endDate})
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default WeekSeparator;
