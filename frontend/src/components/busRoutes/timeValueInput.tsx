import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Box,
  Grid,
  FormHelperText,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { TimeValue, DayType } from 'src/types/busRoute.types';

// Тип для значения времени (исключаем 'daySpecific' так как он требует отдельной обработки)
type TimeValueType = TimeValue['type'];

// Константа с допустимыми типами времени
const TIME_TYPES: TimeValueType[] = ['simple', 'range', 'text', 'continued'];

// Маппинг для отображения названий
const TIME_TYPE_LABELS: Record<TimeValueType, string> = {
  simple: 'Простое время',
  range: 'Диапазон дней',
  text: 'Текстовая отметка',
  continued: 'Далее по маршруту',
  daySpecific: ''
};

// Типы дней для селекта
const DAY_TYPES: DayType[] = [
  'working',
  'weekend',
  'holiday',
  'monday_thursday',
  'friday',
  'saturday',
  'sunday',
];

const DAY_TYPE_LABELS: Record<DayType, string> = {
  working: 'Рабочие дни',
  weekend: 'Выходные',
  holiday: 'Праздничные',
  monday_thursday: 'Пн-Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

interface TimeValueInputProps {
  value: TimeValue;
  onChange: (value: TimeValue) => void;
  error?: string;
  disabled?: boolean;
}

/**
 * Компонент для ввода времени в разных форматах
 */
export const TimeValueInput: React.FC<TimeValueInputProps> = ({
  value,
  onChange,
  error,
  disabled = false,
}) => {
  /**
   * Обработчик изменения типа времени
   */
  const handleTypeChange = (event: SelectChangeEvent): void => {
    const newType = event.target.value as TimeValueType;
    
    switch (newType) {
      case 'simple':
        onChange({ 
          type: 'simple', 
          simpleTime: '' 
        });
        break;
        
      case 'text':
        onChange({ 
          type: 'text', 
          text: '' 
        });
        break;
        
      case 'continued':
        onChange({ 
          type: 'continued', 
          isContinued: true 
        });
        break;
        
      case 'range':
        onChange({
          type: 'range',
          dayRange: { 
            from: 'working', 
            to: 'working', 
            time: '' 
          }
        });
        break;
    }
  };

  /**
   * Валидация формата времени ЧЧ:ММ
   */
  const isValidTimeFormat = (time: string): boolean => {
    return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
  };

  /**
   * Обработчик изменения простого времени
   */
  const handleSimpleTimeChange = (simpleTime: string): void => {
    if (value.type === 'simple') {
      onChange({
        ...value,
        simpleTime,
      });
    }
  };

  /**
   * Обработчик изменения текста
   */
  const handleTextChange = (text: string): void => {
    if (value.type === 'text') {
      onChange({
        ...value,
        text,
      });
    }
  };

  /**
   * Обработчик изменения диапазона
   */
  const handleRangeChange = (
    field: 'from' | 'to' | 'time',
    fieldValue: string
  ): void => {
    if (value.type === 'range' && value.dayRange) {
      onChange({
        type: 'range',
        dayRange: {
          ...value.dayRange,
          [field]: fieldValue,
        },
      });
    }
  };

  return (
    <Box>
      {/* Выбор типа времени */}
      <FormControl fullWidth size="small" error={!!error}>
        <InputLabel>Тип времени</InputLabel>
        <Select
          value={value.type}
          label="Тип времени"
          onChange={handleTypeChange}
          disabled={disabled}
        >
          {TIME_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {TIME_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>

      {/* Поле ввода в зависимости от типа */}
      <Box sx={{ mt: 2 }}>
        {value.type === 'simple' && (
          <TextField
            size="small"
            fullWidth
            label="Время"
            value={value.simpleTime || ''}
            onChange={(e) => handleSimpleTimeChange(e.target.value)}
            placeholder="ЧЧ:ММ"
            error={!!error || (value.simpleTime ? !isValidTimeFormat(value.simpleTime) : false)}
            helperText={
              (error) || 
              (value.simpleTime && !isValidTimeFormat(value.simpleTime) 
                ? 'Неверный формат времени. Используйте ЧЧ:ММ' 
                : '')
            }
            disabled={disabled}
          />
        )}

        {value.type === 'text' && (
          <TextField
            size="small"
            fullWidth
            label="Текст"
            value={value.text || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Например: Простой транспорта (0,5 часа)"
            error={!!error}
            helperText={error}
            disabled={disabled}
            multiline
            rows={2}
          />
        )}

        {value.type === 'continued' && (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            ⏭️ Далее по маршруту
          </Typography>
        )}

        {value.type === 'range' && value.dayRange && (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>От</InputLabel>
                <Select
                  value={value.dayRange.from}
                  label="От"
                  onChange={(e) => handleRangeChange('from', e.target.value)}
                  disabled={disabled}
                >
                  {DAY_TYPES.map((dayType) => (
                    <MenuItem key={dayType} value={dayType}>
                      {DAY_TYPE_LABELS[dayType]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel>До</InputLabel>
                <Select
                  value={value.dayRange.to}
                  label="До"
                  onChange={(e) => handleRangeChange('to', e.target.value)}
                  disabled={disabled}
                >
                  {DAY_TYPES.map((dayType) => (
                    <MenuItem key={dayType} value={dayType}>
                      {DAY_TYPE_LABELS[dayType]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Время"
                value={value.dayRange.time}
                onChange={(e) => handleRangeChange('time', e.target.value)}
                placeholder="ЧЧ:ММ"
                error={!!error || (value.dayRange.time ? !isValidTimeFormat(value.dayRange.time) : false)}
                helperText={
                  (error) || 
                  (value.dayRange.time && !isValidTimeFormat(value.dayRange.time) 
                    ? 'Неверный формат времени. Используйте ЧЧ:ММ' 
                    : '')
                }
                disabled={disabled}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
};