import React from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  IconButton,
  Checkbox,
  Tooltip,
  Box,
} from '@mui/material';
import { Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material';
import { useFormContext, useWatch } from 'react-hook-form';
import { BusRouteFormValues } from 'src/types/busRoute.types';
import { TimeValueInput } from './timeValueInput';
import { formatTimeValue } from '@utils/timeValueUtils';

interface BusStopRowProps {
  scheduleIndex: number;
  stopIndex: number;
  onRemove: () => void;
  disabled?: boolean;
}

// Константа для времени специальной отметки
const SPECIAL_NOTE_TIME = {
  type: 'text' as const,
  text: ' ', // Пробел, чтобы проходило валидацию
};

/**
 * Компонент строки остановки в расписании
 */
export const BusStopRow: React.FC<BusStopRowProps> = ({
  scheduleIndex,
  stopIndex,
  onRemove,
  disabled = false,
}) => {
  const {
    register,
    setValue,

    control,
    formState: { errors },
  } = useFormContext<BusRouteFormValues>();

  // Используем useWatch для отслеживания изменений
  const isSpecialNote = useWatch({
    control,
    name: `schedules.${scheduleIndex}.busStops.${stopIndex}.isSpecialNote`,
  });

  const timeValue = useWatch({
    control,
    name: `schedules.${scheduleIndex}.busStops.${stopIndex}.time`,
  });

  const stopErrors = errors.schedules?.[scheduleIndex]?.busStops?.[stopIndex];

  // Эффект для автоматической установки времени при включении специальной отметки
  React.useEffect(() => {
    if (isSpecialNote) {
      // Если включена специальная отметка, устанавливаем тип времени text с пробелом
      setValue(
        `schedules.${scheduleIndex}.busStops.${stopIndex}.time`,
        SPECIAL_NOTE_TIME,
        { shouldValidate: true }
      );
    }
  }, [isSpecialNote, scheduleIndex, stopIndex, setValue]);

  return (
    <TableRow
      sx={{
        '&:hover': { bgcolor: 'action.hover' },
        ...(isSpecialNote && { bgcolor: 'warning.lighter' }),
      }}
    >
      <TableCell align="center" width="50">
        {stopIndex + 1}
      </TableCell>

      <TableCell width="25%">
        <TextField
          {...register(`schedules.${scheduleIndex}.busStops.${stopIndex}.name`)}
          size="small"
          placeholder={
            isSpecialNote ? 'Название отметки' : 'Название остановки'
          }
          error={!!stopErrors?.name}
          helperText={stopErrors?.name?.message}
          disabled={disabled}
          fullWidth
        />
      </TableCell>

      <TableCell width="30%">
        {isSpecialNote ? (
          // Для специальных отметок адрес не требуется
          <TextField
            {...register(
              `schedules.${scheduleIndex}.busStops.${stopIndex}.address`
            )}
            size="small"
            placeholder="Адрес (необязательно для отметок)"
            disabled={disabled}
            fullWidth
          />
        ) : (
          <TextField
            {...register(
              `schedules.${scheduleIndex}.busStops.${stopIndex}.address`
            )}
            size="small"
            placeholder="Адрес остановки"
            error={!!stopErrors?.address}
            helperText={stopErrors?.address?.message}
            disabled={disabled}
            fullWidth
          />
        )}
      </TableCell>

      <TableCell width="25%">
        <TimeValueInput
          value={timeValue}
          onChange={(newTime) =>
            setValue(
              `schedules.${scheduleIndex}.busStops.${stopIndex}.time`,
              newTime
            )
          }
          error={stopErrors?.time?.message}
          disabled={disabled || isSpecialNote} // Блокируем изменение времени для спец. отметок
        />
        {timeValue && !stopErrors?.time && !isSpecialNote && (
          <Box
            component="span"
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              mt: 0.5,
              display: 'block',
            }}
          >
            {formatTimeValue(timeValue)}
          </Box>
        )}
        {isSpecialNote && (
          <Box
            component="span"
            sx={{
              fontSize: '0.75rem',
              color: 'warning.main',
              mt: 0.5,
              display: 'block',
              fontStyle: 'italic',
            }}
          >
            Время не требуется для отметки
          </Box>
        )}
      </TableCell>

      <TableCell width="100" align="center">
        <Tooltip title="Специальная отметка (простой и т.п.)">
          <Checkbox
            size="large"
            checked={isSpecialNote || false}
            onChange={(e) => {
              const checked = e.target.checked;

              // При включении специальной отметки
              if (checked) {
                // Очищаем адрес
                setValue(
                  `schedules.${scheduleIndex}.busStops.${stopIndex}.address`,
                  ''
                );

                // Устанавливаем время как text с пробелом
                setValue(
                  `schedules.${scheduleIndex}.busStops.${stopIndex}.time`,
                  SPECIAL_NOTE_TIME,
                  { shouldValidate: true }
                );
              } else {
                // При выключении - сбрасываем время на простой тип
                setValue(
                  `schedules.${scheduleIndex}.busStops.${stopIndex}.time`,
                  { type: 'simple', simpleTime: '' },
                  { shouldValidate: true }
                );
              }

              // Устанавливаем флаг специальной отметки
              setValue(
                `schedules.${scheduleIndex}.busStops.${stopIndex}.isSpecialNote`,
                checked,
                { shouldValidate: true }
              );
            }}
            disabled={disabled}
            icon={<InfoIcon />}
            checkedIcon={<InfoIcon color="warning" />}
          />
        </Tooltip>
      </TableCell>

      <TableCell width="80" align="center">
        <IconButton
          size="small"
          onClick={onRemove}
          disabled={disabled}
          color="error"
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
