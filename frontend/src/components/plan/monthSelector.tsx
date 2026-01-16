import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { MonthOption } from '../../types/workPlan.types';
import { MONTHS } from '@utils/dateUtils';


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
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        1. Выберите месяц
      </Typography>

      <FormControl fullWidth sx={{ mb: 2 }} disabled={isLoading}>
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
        <Box mt={1}>
          <Typography variant="body2" color="text.secondary">
            Выбран: {MONTHS[selectedMonthData.monthNumber - 1]}{' '}
            {selectedMonthData.year} года
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default MonthSelector;
