import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Box,
  Typography,
} from '@mui/material';
import { ScheduleType } from 'src/types/schedule.types';

type ScheduleTypeSelectorProps = {
  scheduleType: ScheduleType;
  onChange: (type: ScheduleType) => void;
  error?: string;
  disabled?: boolean;
};

const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  scheduleType,
  onChange,
  error,
  disabled,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Тип графика
      </Typography>
      <FormControl component="fieldset" error={!!error} disabled={disabled}>
        <FormLabel component="legend">Выберите тип графика</FormLabel>
        <RadioGroup
          row
          value={scheduleType}
          onChange={(e) => onChange(e.target.value as ScheduleType)}
        >
          <FormControlLabel
            value="responsibleOnWeekends"
            control={<Radio />}
            label="Дежурства на выходных"
          />
          <FormControlLabel
            value="safetyOfficers"
            control={<Radio />}
            label="Проверки охраны труда"
          />
        </RadioGroup>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    </Box>
  );
};

export default ScheduleTypeSelector;
