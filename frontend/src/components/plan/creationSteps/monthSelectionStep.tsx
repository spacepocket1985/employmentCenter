import React from 'react';

import { Paper, Typography, Box } from '@mui/material';
import { planStylesForCreate } from 'src/const';

import { MonthOption } from 'src/types/workPlan.types';
import MonthSelector from '../dataSelectors/monthSelector';

interface MonthSelectionStepProps {
  selectedMonth: string;
  availableMonths: MonthOption[];
  isLoading: boolean;
  onMonthSelect: (value: string) => void;
}

export const MonthSelectionStep: React.FC<MonthSelectionStepProps> = ({
  selectedMonth,
  availableMonths,
  isLoading,
  onMonthSelect,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      elevation={3}
    >
      <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
        1.Выберите месяц
      </Typography>
      <Box sx={{ mt: 2, flexGrow: 1 }}>
        <MonthSelector
          selectedMonth={selectedMonth}
          availableMonths={availableMonths}
          onMonthSelect={onMonthSelect}
          isLoading={isLoading}
        />
      </Box>
    </Paper>
  );
};
