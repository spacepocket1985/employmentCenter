import React from 'react';
import { Paper, Typography } from '@mui/material';
import { PRINT_HEADER_STYLES } from 'src/const/printStyles';

interface PlanHeaderProps {
  monthName: string;
  year: number;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ monthName, year }) => {
  return (
    <Paper
      className="plan-header"
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #103896, #1a4ec2)',
        color: 'white',
        '@media print': PRINT_HEADER_STYLES,
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ 
          fontWeight: 700,
          '@media print': {
            color: 'black !important',
          },
        }}
      >
        ПЛАН мероприятий
        <br />
        по Гродненской ТЭЦ-2 на {monthName} {year} года
      </Typography>
    </Paper>
  );
};

export default PlanHeader;