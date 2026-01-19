import React, { useEffect, useMemo, useState } from 'react';
import { Box, Autocomplete, TextField } from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';

// Тип времени, как в слайсе: строки вида "08:15"
export interface TimeOption {
  label: string; // отображаемый текст, например "08:15"
  value: string; // значение, например "08:15"
}

// Пропсы TimeSelect
export interface TimeSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  allowCustom?: boolean;
  maxLength?: number;
  error?: boolean;
  helperText?: string;
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
  error,
  helperText,
}) => {
  // локальное состояние для ручного ввода
  const [inputValue, setInputValue] = useState<string>(value);
  const [open, setOpen] = useState<boolean>(false);
  const [, setIsTyping] = useState<boolean>(false);
  const [hasFormatError, setHasFormatError] = useState<boolean>(false);

  // синхронизация снаружи
  useEffect(() => {
    setInputValue(value);
    // Проверяем формат при получении нового значения
    if (value && !isValidTimeFormat(value)) {
      setHasFormatError(true);
    } else {
      setHasFormatError(false);
    }
  }, [value]);

  const timeOptions: TimeOption[] = useAppSelector(
    (state) =>
      state.data.timeActivities.map((t) => ({
        label: t,
        value: t,
      })) as TimeOption[]
  );

  // Получаем массив значений для Autocomplete
  const options = useMemo(
    () => timeOptions.map((option) => option.value),
    [timeOptions]
  );

  // Обработчик изменения значения (выбор из списка или ввод)
  const handleChange = (_: React.SyntheticEvent, newValue: string | null) => {
    if (newValue !== null) {
      const trimmedValue = newValue.trim();
      onChange(trimmedValue);
      setInputValue(trimmedValue);
      setIsTyping(false);
      setHasFormatError(false);
    }
  };

  // Обработчик ввода (при каждом изменении текста)
  const handleInputChange = (
    _: React.SyntheticEvent,
    newInputValue: string
  ) => {
    setInputValue(newInputValue);
    setIsTyping(true);
    
    // Проверяем формат в реальном времени
    if (newInputValue.trim() && !isValidTimeFormat(newInputValue.trim())) {
      setHasFormatError(true);
    } else {
      setHasFormatError(false);
    }

    // Если пользователь вводит время, проверяем формат и обновляем значение
    if (
      allowCustom &&
      newInputValue.trim() &&
      isValidTimeFormat(newInputValue.trim())
    ) {
      onChange(newInputValue.trim());
    }
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    if (allowCustom && inputValue.trim() !== value) {
      // Если значение изменилось и формат валидный, обновляем
      if (isValidTimeFormat(inputValue.trim())) {
        onChange(inputValue.trim());
        setHasFormatError(false);
      } else {
        setHasFormatError(true);
      }
    }
    setIsTyping(false);
  };

  // Определяем, есть ли ошибка
  const hasError = error || hasFormatError;
  
  // Определяем текст помощи
  const getHelperText = () => {
    if (helperText) return helperText;
    if (hasFormatError && inputValue.trim() !== '') {
      return 'Неверный формат. Ожидается HH:mm (24ч)';
    }
    if (error) {
      return 'Не указано время мероприятия';
    }
    return '';
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
            error={hasError}
            helperText={getHelperText()}
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
        onBlur={handleBlur}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            size="small"
            fullWidth
            error={hasError}
            helperText={getHelperText()}
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