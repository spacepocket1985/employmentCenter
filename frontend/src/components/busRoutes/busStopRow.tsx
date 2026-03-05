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
import {
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
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

  return (
    <TableRow sx={{ 
      '&:hover': { bgcolor: 'action.hover' },
      ...(isSpecialNote && { bgcolor: 'warning.lighter' })
    }}>
      <TableCell align="center" width="50">
        {stopIndex + 1}
      </TableCell>

      <TableCell width="25%">
        <TextField
          {...register(`schedules.${scheduleIndex}.busStops.${stopIndex}.name`)}
          size="small"
          placeholder="Название остановки"
          error={!!stopErrors?.name}
          helperText={stopErrors?.name?.message}
          disabled={disabled || isSpecialNote}
          fullWidth
        />
      </TableCell>

      <TableCell width="30%">
        <TextField
          {...register(`schedules.${scheduleIndex}.busStops.${stopIndex}.address`)}
          size="small"
          placeholder="Адрес остановки"
          error={!!stopErrors?.address}
          helperText={stopErrors?.address?.message}
          disabled={disabled || isSpecialNote}
          fullWidth
        />
      </TableCell>

      <TableCell width="25%">
        <TimeValueInput
          value={timeValue}
          onChange={(newTime) => 
            setValue(`schedules.${scheduleIndex}.busStops.${stopIndex}.time`, newTime)
          }
          error={stopErrors?.time?.message}
          disabled={disabled}
        />
        {timeValue && !stopErrors?.time && (
          <Box component="span" sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, display: 'block' }}>
            {formatTimeValue(timeValue)}
          </Box>
        )}
      </TableCell>

      <TableCell width="100" align="center">
        <Tooltip title="Специальная отметка (простой и т.п.)">
          <Checkbox
            checked={isSpecialNote || false}
            onChange={(e) => 
              setValue(
                `schedules.${scheduleIndex}.busStops.${stopIndex}.isSpecialNote`, 
                e.target.checked
              )
            }
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