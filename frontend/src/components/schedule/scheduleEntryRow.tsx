// file name: scheduleEntryRow.tsx
import React from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Box,
  Chip,
  Tooltip,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  ScheduleEntryForm,
  ScheduleFormValues,
  ScheduleEntryRowProps,
} from 'src/types/schedule.types';
import { formatDateForDisplay } from 'src/utils/dateUtils';
import DatePickerPopup from './datePickerPopup';
import { UIFormInput } from '@components/ui';

/**
 * Компонент строки графика дежурств
 */
const ScheduleEntryRow: React.FC<ScheduleEntryRowProps> = ({
  index,
  onRemove,
  disabled = false,
}): JSX.Element => {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ScheduleFormValues>();

  const entry = useWatch({
    control,
    name: `entries.${index}`,
  }) as ScheduleEntryForm | undefined;

  const month = useWatch({
    control,
    name: 'month',
  }) as string;

  // Ошибки валидации для этой строки
  const entryErrors = errors.entries?.[index];

  /**
   * Обработчик добавления даты
   */
  const handleAddDate = (date: string): void => {
    if (!entry) return;

    const currentDates = entry.dates || [];
    if (!currentDates.includes(date)) {
      const newDates = [...currentDates, date].sort();
      setValue(`entries.${index}.dates`, newDates, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger(`entries.${index}.dates`);
    }
  };

  /**
   * Обработчик удаления даты
   */
  const handleRemoveDate = (dateToRemove: string): void => {
    if (!entry) return;

    const currentDates = entry.dates || [];
    const newDates = currentDates.filter(
      (date: string) => date !== dateToRemove
    );

    setValue(`entries.${index}.dates`, newDates, {
      shouldValidate: true,
      shouldDirty: true,
    });
    trigger(`entries.${index}.dates`);
  };

  if (!entry) {
    return <h6>no entry</h6>;
  }

  return (
    <TableRow>
      {/* Номер строки */}
      <TableCell>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          {index + 1}
        </Typography>
      </TableCell>

      {/* ФИО */}
      <TableCell>
        <UIFormInput
          name={`entries.${index}.customName`}
          control={control}
          label="ФИО сотрудника"
          disabled={disabled}
          gridSize={12}
          textFieldProps={{
            size: 'small',
            placeholder: 'Введите ФИО',
            variant: 'outlined',
            error: !!entryErrors?.customName,
            helperText: entryErrors?.customName?.message,
            fullWidth: true,
          }}
        />
      </TableCell>

      {/* Должность */}
      <TableCell>
        <UIFormInput
          name={`entries.${index}.customJob`}
          control={control}
          label="Должность"
          disabled={disabled}
          gridSize={12}
          textFieldProps={{
            size: 'small',
            placeholder: 'Введите должность',
            variant: 'outlined',
            error: !!entryErrors?.customJob,
            helperText: entryErrors?.customJob?.message,
            fullWidth: true,
          }}
        />
      </TableCell>

      {/* Даты */}
      <TableCell>
        <Box>
          <Box sx={{ mb: 1 }}>
            <DatePickerPopup
              selectedDates={entry.dates || []}
              onDateSelect={handleAddDate}
              onDateRemove={handleRemoveDate}
              month={month}
              disabled={disabled || !month}
            />
          </Box>

          {entry.dates && entry.dates.length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {entry.dates.map((date: string) => (
                <Chip
                  key={date}
                  label={formatDateForDisplay(date)}
                  size="small"
                  onDelete={() => handleRemoveDate(date)}
                  disabled={disabled}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          ) : (
            <Typography
              variant="caption"
              color="error"
              sx={{ mt: 1, display: 'block' }}
            >
              {entryErrors?.dates?.message || 'Добавьте хотя бы одну дату'}
            </Typography>
          )}
        </Box>
      </TableCell>

      {/* Удаление */}
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
