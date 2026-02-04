import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Typography,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { ScheduleEntryRowProps } from 'src/types/schedule.types';
import { formatDateForDisplay } from 'src/utils/dateUtils';
import DatePickerPopup from './datePickerPopup';

/**
 * Компонент строки графика дежурств
 * Отображает информацию о сотруднике и его датах дежурства
 * Позволяет редактировать данные и выбирать даты через календарь
 */
const ScheduleEntryRow: React.FC<ScheduleEntryRowProps> = ({
  entry,
  index,
  onUpdate,
  onRemove,
  onAddDate,
  onRemoveDate,
  errors = [],
  disabled = false,
}) => {
  const [dateInput, setDateInput] = useState('');

  /**
   * Обработчик изменения ФИО
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ customName: e.target.value });
  };

  /**
   * Обработчик изменения должности
   */
  const handleJobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ customJob: e.target.value });
  };

  /**
   * Обработчик изменения поля ввода даты
   */
  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateInput(e.target.value);
  };

  /**
   * Добавление даты дежурства через текстовое поле
   */
  const handleAddDateFromInput = () => {
    if (!dateInput.trim()) return;
    
    onAddDate(dateInput);
    setDateInput('');
  };

  /**
   * Обработчик нажатия Enter в поле ввода даты
   */
  const handleDateKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddDateFromInput();
    }
  };

  /**
   * Получение ошибок для конкретного поля
   */
  const getNameError = () => errors.find((e) => e.includes('ФИО') || e.includes('сотрудника'));
  const getJobError = () => errors.find((e) => e.includes('Должность') || e.includes('должность'));
  const getDatesError = () => errors.find((e) => e.includes('дату') || e.includes('дат'));

  return (
    <TableRow>
      {/* Номер строки */}
      <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ mr: 1 }}>
            {index + 1}
          </Typography>
          {entry.isFromTemplate && (
            <Tooltip title="Строка создана из базы сотрудников">
              <PersonIcon color="primary" fontSize="small" />
            </Tooltip>
          )}
        </Box>
      </TableCell>

      {/* Поле ФИО */}
      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={entry.customName}
          onChange={handleNameChange}
          error={!!getNameError()}
          helperText={getNameError()}
          disabled={disabled || entry.isFromTemplate}
          placeholder="Введите ФИО"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>

      {/* Поле должности */}
      <TableCell>
        <TextField
          fullWidth
          size="small"
          value={entry.customJob}
          onChange={handleJobChange}
          error={!!getJobError()}
          helperText={getJobError()}
          disabled={disabled || entry.isFromTemplate}
          placeholder="Введите должность"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WorkIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />
      </TableCell>

      {/* Поле для выбора дат */}
      <TableCell>
        <Stack spacing={1}>
          {/* Календарь для выбора дат */}
          <Box>
            <DatePickerPopup
              selectedDates={entry.dates}
              onDateSelect={onAddDate}
              onDateRemove={onRemoveDate}
              month={entry.dates[0] ? entry.dates[0].substring(0, 7) : ''}
              disabled={disabled}
            />
          </Box>

          {/* Быстрый ввод даты через текстовое поле */}
          <Box>
            <TextField
              fullWidth
              size="small"
              value={dateInput}
              onChange={handleDateInputChange}
              onKeyPress={handleDateKeyPress}
              placeholder="Быстрый ввод: ГГГГ-ММ-ДД"
              disabled={disabled}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
              helperText="Используйте календарь или введите дату в формате ГГГГ-ММ-ДД"
            />
          </Box>

          {/* Отображение добавленных дат */}
          {entry.dates.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {entry.dates.map((date) => (
                <Chip
                  key={date}
                  label={formatDateForDisplay(date)}
                  size="small"
                  onDelete={() => onRemoveDate(date)}
                  disabled={disabled}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Даты не добавлены. Нажмите на иконку календаря для выбора.
            </Typography>
          )}

          {/* Отображение ошибок валидации дат */}
          {getDatesError() && (
            <Typography color="error" variant="caption" sx={{ display: 'block' }}>
              {getDatesError()}
            </Typography>
          )}
        </Stack>
      </TableCell>

      {/* Кнопка удаления строки */}
      <TableCell align="center">
        <Tooltip title="Удалить строку">
          <IconButton
            onClick={onRemove}
            disabled={disabled}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export default ScheduleEntryRow;