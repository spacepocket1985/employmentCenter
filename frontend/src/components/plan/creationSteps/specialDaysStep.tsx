import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

import { planStylesForCreate } from 'src/const';
import { SpecialDaysSelector } from '../dataSelectors';

interface SpecialDaysStepProps {
  allDays: Array<{ dayNumber: number; dayOfWeek: string }>;
  specialDays: Array<{
    id: string;
    dayNumber: number;
    title: string;
    dayOfWeek: string;
  }>;
  selectedMonthNumber: number;
  title?: string;
  isLoading: boolean;
  onAddSpecialDay: (dayNumber: number, title: string) => void;
  onRemoveSpecialDay: (id: string) => void;
}

export const SpecialDaysStep: React.FC<SpecialDaysStepProps> = ({
  allDays,
  specialDays,
  selectedMonthNumber,
  isLoading,
  onAddSpecialDay,
  onRemoveSpecialDay,
  title = '3. Укажите специальные дни',
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
        {title}
      </Typography>
      <Box sx={{ mt: 2, flexGrow: 1 }}>
        <SpecialDaysSelector
          allDays={allDays}
          specialDays={specialDays}
          selectedMonthNumber={selectedMonthNumber}
          onAddSpecialDay={onAddSpecialDay}
          onRemoveSpecialDay={onRemoveSpecialDay}
          disabled={isLoading}
        />
      </Box>
    </Paper>
  );
};
