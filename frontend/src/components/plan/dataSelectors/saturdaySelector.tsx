import React from 'react';
import { Typography, Box, Chip } from '@mui/material';
import { SaturdayData } from '../../../types/workPlan.types';

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
  onSaturdayToggle,
  disabled = false,
}) => {
  if (saturdays.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" paragraph>
        По умолчанию все субботы нерабочие. Отметьте субботы, которые являются
        рабочими:
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {saturdays.map((saturday) => (
          <Chip
            key={saturday.dayNumber}
            label={`${saturday.dayNumber} (суббота)`}
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
            size="small"
          />
        ))}
      </Box>

      <Typography variant="caption" color="text.secondary">
        Всего суббот в месяце: {saturdays.length}
      </Typography>
    </Box>
  );
};

export default SaturdaySelector;
