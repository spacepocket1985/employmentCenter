import React from 'react';
import { Box } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { UIFormRadio, UITitle } from '@components/ui';

interface ScheduleTypeSelectorProps {
  disabled?: boolean;
}

/**
 * Компонент для выбора типа графика с использованием UIFormRadio
 */
const ScheduleTypeSelector: React.FC<ScheduleTypeSelectorProps> = ({
  disabled = false,
}): JSX.Element => {
  const { control, watch } = useFormContext();
  const currentScheduleType = watch('scheduleType');

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
      {currentScheduleType && (
        <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
          Выбран тип:{' '}
          {scheduleTypeOptions.find((opt) => opt.value === currentScheduleType)
            ?.label || currentScheduleType}
        </Box>
      )}
    </Box>
  );
};

export default ScheduleTypeSelector;