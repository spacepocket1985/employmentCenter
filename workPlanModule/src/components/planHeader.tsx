import React from 'react';
import { Paper, Typography } from '@mui/material';

interface PlanHeaderProps {
  monthName: string;
  year: number;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ monthName, year }) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #103896, #1a4ec2)',
        color: 'white',
      }}
    >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: 700 }}
      >
        ПЛАН мероприятий
        <br />
        по Гродненской ТЭЦ-2 на {monthName} {year} года
      </Typography>
    </Paper>
  );
};

export default PlanHeader;
