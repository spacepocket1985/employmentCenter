import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import { MONTHS } from '@utils/dateUtils';
import { MonthOption } from 'src/types/workPlan.types';

interface MonthSelectorProps {
  selectedMonth: string;
  availableMonths: MonthOption[];
  onMonthSelect: (value: string) => void;
  isLoading?: boolean;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedMonth,
  availableMonths,
  onMonthSelect,
  isLoading = false,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    onMonthSelect(event.target.value);
  };

  const selectedMonthData = availableMonths.find(
    (month) => month.value === selectedMonth
  );

  return (
    <Box>
      <FormControl fullWidth disabled={isLoading}>
        <InputLabel>Месяц и год</InputLabel>
        <Select
          value={selectedMonth}
          label="Месяц и год"
          onChange={handleChange}
        >
          {availableMonths.map((month) => (
            <MenuItem
              key={month.value}
              value={month.value}
              disabled={!month.isAvailable}
              sx={{
                opacity: month.isAvailable ? 1 : 0.6,
              }}
            >
              {month.label} {!month.isAvailable && '(уже создан)'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedMonth && selectedMonthData && (
        <Box mt={2}>
          <Typography variant='body2' color="text.secondary">
            Выбран: <strong>{MONTHS[selectedMonthData.monthNumber - 1]} {selectedMonthData.year}</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MonthSelector;