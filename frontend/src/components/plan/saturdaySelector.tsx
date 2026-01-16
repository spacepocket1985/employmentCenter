import React from 'react';
import { Typography, Paper, Box, Button, Chip } from '@mui/material';
import { SaturdayData } from '../../types/workPlan.types';
import { MONTHS } from '@utils/dateUtils';

interface SaturdaySelectorProps {
  saturdays: SaturdayData[];
  workingSaturdays: number[];
  selectedMonthNumber: number;
  onSaturdayToggle: (dayNumber: number) => void;
  onCreateTemplate: () => void;
  disabled?: boolean;
}

const SaturdaySelector: React.FC<SaturdaySelectorProps> = ({
  saturdays,
  workingSaturdays,
  selectedMonthNumber,
  onSaturdayToggle,
  onCreateTemplate,
  disabled = false,
}) => {
  if (saturdays.length === 0) {
    return null;
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        2. Укажите рабочие субботы
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        По умолчанию все субботы нерабочие. Отметьте субботы, которые являются
        рабочими:
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {saturdays.map((saturday) => (
          <Chip
            key={saturday.dayNumber}
            label={`${saturday.dayNumber} ${
              MONTHS[selectedMonthNumber - 1]
            } (суббота)`}
            color={
              workingSaturdays.includes(saturday.dayNumber)
                ? 'primary'
                : 'default'
            }
            variant={
              workingSaturdays.includes(saturday.dayNumber)
                ? 'filled'
                : 'outlined'
            }
            onClick={() => onSaturdayToggle(saturday.dayNumber)}
            clickable
            disabled={disabled}
          />
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={onCreateTemplate}
        disabled={disabled || saturdays.length === 0}
      >
        Создать шаблон плана
      </Button>
    </Paper>
  );
};

export default SaturdaySelector;
