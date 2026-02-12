import React from 'react';
import { Box } from '@mui/material';
import { MonthOption } from 'src/types/schedule.types';
import { useFormContext } from 'react-hook-form';
import { UIFormSelect, UITitle } from '@components/ui';

interface MonthSelectorProps {
  monthOptions: MonthOption[];
  disabled?: boolean;
}

/**
 * Компонент для выбора месяца с использованием UIFormSelect
 */
const MonthSelector: React.FC<MonthSelectorProps> = ({
  monthOptions,
  disabled = false,
}): JSX.Element => {
  const { control } = useFormContext();

  const selectOptions = monthOptions.map((option: MonthOption) => ({
    value: option.value,
    label: option.label,
  }));

  return (
    <Box sx={{ mb: 3 }}>
      <UITitle>Выберите месяц</UITitle>
      <UIFormSelect
        name="month"
        control={control}
        label="Месяц"
        options={selectOptions}
        disabled={disabled}
        gridSize={12}
        variant="outlined"
        selectProps={{
          size: 'small',
          fullWidth: true,
        }}
      />
    </Box>
  );
};

export default MonthSelector;