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
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { ScheduleEntryForm, ScheduleFormValues } from 'src/types/schedule.types';
import { formatDateForDisplay } from 'src/utils/dateUtils';
import DatePickerPopup from './datePickerPopup';
import { UIFormInput } from '@components/ui';


interface ScheduleEntryRowProps {
  /** Индекс записи в массиве */
  index: number;
  /** Функция удаления записи */
  onRemove: () => void;
  /** Отключенное состояние */
  disabled?: boolean;
}

/**
 * Компонент строки графика дежурств с использованием react-hook-form и UIFormInput
 */
const ScheduleEntryRow: React.FC<ScheduleEntryRowProps> = ({
  index,
  onRemove,
  disabled = false,
}): JSX.Element => {
  const { control, setValue, trigger } = useFormContext<ScheduleFormValues>();
  
  const entry: ScheduleEntryForm = useWatch({
    control,
    name: `entries.${index}` as const,
  });

  const month: string = useWatch({
    control,
    name: 'month' as const,
  });

  /**
   * Обработчик добавления даты к записи
   */
  const handleAddDate = (date: string): void => {
    const currentDates: string[] = entry?.dates || [];
    if (!currentDates.includes(date)) {
      const newDates: string[] = [...currentDates, date].sort();
      setValue(`entries.${index}.dates`, newDates, {
        shouldValidate: true,
        shouldDirty: true,
      });
      trigger(`entries.${index}.dates`);
    }
  };

  /**
   * Обработчик удаления даты из записи
   */
  const handleRemoveDate = (dateToRemove: string): void => {
    const currentDates: string[] = entry?.dates || [];
    const newDates: string[] = currentDates.filter((date: string) => date !== dateToRemove);
    
    setValue(`entries.${index}.dates`, newDates, {
      shouldValidate: true,
      shouldDirty: true,
    });
    trigger(`entries.${index}.dates`);
  };

  if (!entry) {
    return <div>no entry</div>;
  }

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
        <UIFormInput
          name={`entries.${index}.customName` as const}
          control={control}
          label="ФИО сотрудника"
          disabled={disabled || entry.isFromTemplate}
          gridSize={12}
          textFieldProps={{
            size: 'small',
            placeholder: 'Введите ФИО',
            variant: 'outlined',
          }}
        />
      </TableCell>

      {/* Поле должности */}
      <TableCell>
        <UIFormInput
          name={`entries.${index}.customJob` as const}
          control={control}
          label="Должность"
          disabled={disabled || entry.isFromTemplate}
          gridSize={12}
          textFieldProps={{
            size: 'small',
            placeholder: 'Введите должность',
            variant: 'outlined',
          }}
        />
      </TableCell>

      {/* Поле для выбора дат */}
      <TableCell>
        <Box>
          {/* Календарь для выбора дат */}
          <Box sx={{ mb: 1 }}>
            <DatePickerPopup
              selectedDates={entry.dates || []}
              onDateSelect={handleAddDate}
              onDateRemove={handleRemoveDate}
              month={month}
              disabled={disabled || !month}
            />
          </Box>

          {/* Отображение добавленных дат */}
          {(entry.dates || []).length > 0 ? (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {entry.dates.map((date: string) => (
                <Chip
                  key={date}
                  label={formatDateForDisplay(date)}
                  size="small"
                  onDelete={(): void => handleRemoveDate(date)}
                  disabled={disabled}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Даты не добавлены. Нажмите на иконку календаря для выбора.
            </Typography>
          )}
        </Box>
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