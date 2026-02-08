import React from 'react';
import { Box } from '@mui/material';

import { useFormContext } from 'react-hook-form';
import { UIFormRadio, UITitle } from '@components/ui';

interface ScheduleTypeSelectorProps {
  /** Отключенное состояние */
  disabled?: boolean;
}

/**
 * Компонент для выбора типа графика с использованием UIFormRadio
 */
const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  disabled = false,
}): JSX.Element => {
  const { control } = useFormContext();

  const scheduleTypeOptions = [
    { value: 'responsibleOnWeekends', label: 'Дежурства на выходных' },
    { value: 'safetyOfficers', label: 'Проверки охраны труда' },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <UITitle>Тип графика</UITitle>

      <UIFormRadio
        name="scheduleType"
        control={control}
        options={scheduleTypeOptions}
        disabled={disabled}
        gridSize={12}
      />
    </Box>
  );
};

export default ScheduleTypeSelector;
