import React, { useState, useMemo } from 'react';
import {
  TextField,
  Autocomplete,
  Box,
  Popper,
  PopperProps,
  TextFieldProps,
  createFilterOptions,
  FilterOptionsState,
} from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';

interface ActivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  TextFieldProps?: Partial<TextFieldProps>;
}

const filter = createFilterOptions<string>();

const CustomPopper = (props: PopperProps) => {
  return <Popper {...props} placement="bottom-start" />;
};

const ActivitySelect: React.FC<ActivitySelectProps> = ({
  value,
  onChange,
  label = 'Мероприятие',
  placeholder = 'Выберите или введите мероприятие',
  disabled = false,
  TextFieldProps = {},
}) => {
  const { activities } = useAppSelector((state) => state.data);

  const [inputValue, setInputValue] = useState('');

  // Создаем функцию для получения лейбла опции
  const getOptionLabel = (option: string): string => {
    // Если значение из предложения "Добавить"
    if (option.startsWith('Добавить: ')) {
      return option.replace('Добавить: ', '');
    }
    return option;
  };

  // Фильтруем опции
  const filteredOptions = useMemo(() => {
    const filterState: FilterOptionsState<string> = {
      inputValue,
      getOptionLabel,
    };
    return filter(activities, filterState);
  }, [activities, inputValue]);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: string | null
  ) => {
    if (newValue) {
      // Убираем префикс "Добавить: " если он есть
      const cleanValue = newValue.startsWith('Добавить: ')
        ? newValue.replace('Добавить: ', '')
        : newValue;
      onChange(cleanValue);
    }
  };

  const handleInputChange = (
    event: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
  };

  return (
    <Autocomplete
      freeSolo
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={filteredOptions}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          sx={{
            '& .MuiInputBase-root': {
              alignItems: 'flex-start',
            },
          }}
          {...TextFieldProps}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option}>
          <Box sx={{ wordBreak: 'break-word', whiteSpace: 'normal' }}>
            {getOptionLabel(option)}
          </Box>
        </li>
      )}
      PopperComponent={CustomPopper}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Предлагаем создать новую опцию
        const isExisting = options.some((option) => inputValue === option);
        if (inputValue !== '' && !isExisting) {
          filtered.push(`Добавить: "${inputValue}"`);
        }

        return filtered;
      }}
      getOptionLabel={getOptionLabel}
    />
  );
};

export default ActivitySelect;