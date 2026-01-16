
import React from 'react';
import { Typography } from '@mui/material';
import { MONTHS } from '@utils/dateUtils';

interface PlanHeaderProps {
  monthNumber: number;
  year: number;
}

const PlanHeader: React.FC<PlanHeaderProps> = ({ monthNumber, year }) => {
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
      на {MONTHS[monthNumber - 1]} {year} года
    </Typography>
  );
};

export default PlanHeader;