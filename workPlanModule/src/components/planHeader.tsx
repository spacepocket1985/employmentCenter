import React from 'react';
import { Typography } from '@mui/material';

interface PlanHeaderProps {
  monthName: string;
  year: number;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ monthName, year }) => {
  return (
    <Typography
      variant="h5"
      align="center"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        textTransform: 'uppercase',
        mb: 4,
      }}
    >
      П Л А Н
      <br />
      мероприятий по Гродненской ТЭЦ-2
      <br />
      на {monthName} {year} года
    </Typography>
  );
};

export default PlanHeader;
