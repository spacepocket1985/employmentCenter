import React, { useState, useMemo, useRef } from 'react';
import {
  TextField,
  Box,
  TextFieldProps,
  createFilterOptions,
  FilterOptionsState,
  ClickAwayListener,
  Paper,
  ListItem,
} from '@mui/material';
import { useAppSelector } from '@hooks/storeHooks';

interface ActivitySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  TextFieldProps?: Partial<TextFieldProps>;
}

const filter = createFilterOptions<string>();

const ActivitySelect: React.FC<ActivitySelectProps> = ({
  value,
  onChange,
  label = 'Мероприятие',
  placeholder = 'Выберите или введите мероприятие',
  disabled = false,
  TextFieldProps = {},
  error,
  helperText,
}) => {
  const { activities } = useAppSelector((state) => state.data);
  const [inputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const textFieldRef = useRef<HTMLDivElement>(null);

  // Создаем функцию для получения лейбла опции
  const getOptionLabel = (option: string): string => {
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

  const handleTextFieldKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      // Enter без Shift - открываем/закрываем Autocomplete
      event.preventDefault();
      setIsOpen(!isOpen);
    }
    // Shift+Enter - новая строка (работает по умолчанию в textarea)
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleTextFieldFocus = () => {
    setIsOpen(true);
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative' }}>
        <TextField
          ref={textFieldRef}
          label={label}
          placeholder={placeholder}
          fullWidth
          multiline
          minRows={2}
          maxRows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleTextFieldFocus}
          onKeyDown={handleTextFieldKeyDown}
          error={error}
          helperText={helperText}
          disabled={disabled}
          sx={{
            '& .MuiInputBase-root': {
              alignItems: 'flex-start',
              fontSize: '1rem',
            },
            '& .MuiInputBase-inputMultiline': {
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            },
            ...TextFieldProps?.sx,
          }}
          {...TextFieldProps}
        />

        {/* Кастомный выпадающий список */}
        {isOpen && !disabled && (
          <Paper
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1300,
              maxHeight: 300,
              overflow: 'auto',
              mt: 0.5,
              boxShadow: 3,
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <ListItem
                  key={index}
                  onClick={() => {
                    const cleanValue = option.startsWith('Добавить: ')
                      ? option.replace('Добавить: ', '')
                      : option;
                    onChange(cleanValue);
                    setIsOpen(false);
                  }}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {getOptionLabel(option)}
                </ListItem>
              ))
            ) : (
              <ListItem
                sx={{
                  color: 'text.secondary',
                  fontStyle: 'italic',
                }}
              >
                Введите текст мероприятия
              </ListItem>
            )}
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default ActivitySelect;
