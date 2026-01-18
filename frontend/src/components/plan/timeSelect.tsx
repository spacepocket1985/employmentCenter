import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Autocomplete,
  TextField,
} from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';

// Тип времени, как в слайсе: строки вида "08:15"
export interface TimeOption {
  label: string; // отображаемый текст, например "08:15"
  value: string; // значение, например "08:15"
}

// Пропсы TimeSelect
export interface TimeSelectProps {
  value: string; // текущее выбранное значение, например "08:15"
  onChange: (value: string) => void; // вернуть выбранное значение
  label?: string;
  placeholder?: string;
  allowCustom?: boolean; // разрешить ввод собственного времени
  maxLength?: number;
}

// Валидация формата HH:mm (24ч)
const isValidTimeFormat = (value: string): boolean => {
  const v = value.trim();
  if (v.length === 0) return true; // пустое значение допустимо
  const m = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(v);
  return m !== null;
};

const TimeSelect: React.FC<TimeSelectProps> = ({
  value,
  onChange,
  label = 'Время',
  placeholder = 'Введите или выберите время',
  allowCustom = true,
  maxLength = 5,
}) => {
  // локальное состояние для ручного ввода
  const [inputValue, setInputValue] = useState<string>(value);
  const [open, setOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // синхронизация снаружи
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const timeOptions: TimeOption[] = useAppSelector(
    (state) =>
      state.data.timeActivities.map((t) => ({
        label: t,
        value: t,
      })) as TimeOption[]
  );

  // Получаем массив значений для Autocomplete
  const options = useMemo(() => timeOptions.map(option => option.value), [timeOptions]);

  // Обработчик изменения значения (выбор из списка или ввод)
  const handleChange = (_: React.SyntheticEvent, newValue: string | null) => {
    if (newValue !== null) {
      const trimmedValue = newValue.trim();
      onChange(trimmedValue);
      setInputValue(trimmedValue);
      setIsTyping(false);
    }
  };

  // Обработчик ввода (при каждом изменении текста)
  const handleInputChange = (_: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    setIsTyping(true);
    
    // Если пользователь вводит время, проверяем формат и обновляем значение
    if (allowCustom && newInputValue.trim() && isValidTimeFormat(newInputValue.trim())) {
      onChange(newInputValue.trim());
    }
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    if (allowCustom && inputValue.trim() !== value) {
      // Если значение изменилось и формат валидный, обновляем
      if (isValidTimeFormat(inputValue.trim())) {
        onChange(inputValue.trim());
      }
    }
    setIsTyping(false);
  };

  // Если custom ввод отключен - вернем только Select
  if (!allowCustom) {
    return (
      <Autocomplete
        value={value}
        onChange={handleChange}
        options={options}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            size="small"
            fullWidth
          />
        )}
      />
    );
  }

  return (
    <Box width="100%">
      <Autocomplete
        freeSolo
        value={inputValue}
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={options}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            size="small"
            fullWidth
            onBlur={handleBlur}
            error={isTyping && inputValue.trim() !== '' && !isValidTimeFormat(inputValue.trim())}
            helperText={
              isTyping && inputValue.trim() !== '' && !isValidTimeFormat(inputValue.trim())
                ? 'Неверный формат. Ожидается HH:mm (24ч)'
                : ''
            }
            inputProps={{
              ...params.inputProps,
              maxLength,
            }}
          />
        )}
      />
    </Box>
  );
};

export default TimeSelect;