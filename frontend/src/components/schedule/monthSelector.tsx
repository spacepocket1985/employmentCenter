import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { MonthOption } from 'src/types/schedule.types';

type MonthSelectorProps = {
  month: string;
  monthOptions: MonthOption[];
  onChange: (month: string) => void;
  error?: string;
  disabled?: boolean;
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  month,
  monthOptions,
  onChange,
  error,
  disabled,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Выберите месяц
      </Typography>
      <FormControl fullWidth error={!!error} disabled={disabled}>
        <InputLabel id="month-select-label">Месяц</InputLabel>
        <Select
          labelId="month-select-label"
          value={month}
          label="Месяц"
          onChange={(e) => onChange(e.target.value)}
        >
          {monthOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default MonthSelector;