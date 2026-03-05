// components/busRoute/BusSchedulePanel.tsx
import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  Alert,
  Divider,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  FormHelperText,
  SelectChangeEvent,
  IconButton,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DirectionsBus as BusIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { BusRouteFormValues, DayType } from 'src/types/busRoute.types';
import { BusStopRow } from './busStopRow';

// Метки для типов дней
const DAY_TYPE_LABELS: Record<DayType, string> = {
  working: 'Рабочие дни',
  weekend: 'Выходные дни',
  holiday: 'Праздничные дни',
  monday_thursday: 'Пн-Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
};

// Все доступные типы дней
const DAY_TYPES: DayType[] = [
  'working',
  'weekend',
  'holiday',
  'monday_thursday',
  'friday',
  'saturday',
  'sunday',
];

interface BusSchedulePanelProps {
  scheduleIndex: number;
  onRemove: () => void;
  disabled?: boolean;
}

/**
 * Компонент для управления одним расписанием (утро/вечер)
 */
export const BusSchedulePanel: React.FC<BusSchedulePanelProps> = ({
  scheduleIndex,
  onRemove,
  disabled = false,
}) => {
  const {
    control,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<BusRouteFormValues>();

  // Отслеживаем значения с помощью useWatch для производительности
  const period = useWatch({
    control,
    name: `schedules.${scheduleIndex}.period`,
    defaultValue: 'morning',
  });

  const dayTypes = useWatch({
    control,
    name: `schedules.${scheduleIndex}.dayTypes`,
    defaultValue: [],
  });

  const vehicles = useWatch({
    control,
    name: `schedules.${scheduleIndex}.vehicles`,
    defaultValue: [],
  });

  const busStops = useWatch({
    control,
    name: `schedules.${scheduleIndex}.busStops`,
    defaultValue: [],
  });

  // Field arrays для динамических полей
  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control,
    name: `schedules.${scheduleIndex}.vehicles`,
  });

  const {
    fields: stopFields,
    append: appendStop,
    remove: removeStop,
  } = useFieldArray({
    control,
    name: `schedules.${scheduleIndex}.busStops`,
  });

  // Ошибки для этого расписания
  const scheduleErrors = errors.schedules?.[scheduleIndex];

  // Явно проверяем наличие ошибки для dayTypes
  const dayTypesError = scheduleErrors?.dayTypes?.message;
  const hasDayTypesError = Boolean(dayTypesError && dayTypes.length === 0);

  // Триггерим валидацию при изменении dayTypes
  useEffect(() => {
    if (dayTypes.length > 0) {
      // Если дни выбраны, убираем ошибку валидации
      trigger(`schedules.${scheduleIndex}.dayTypes`);
    }
  }, [dayTypes, scheduleIndex, trigger]);

  /**
   * Обработчик изменения типа дня
   */
  const handleDayTypesChange = (event: SelectChangeEvent<DayType[]>): void => {
    const value = event.target.value;
    const selectedValues =
      typeof value === 'string' ? (value.split(',') as DayType[]) : value;

    // Устанавливаем значение
    setValue(`schedules.${scheduleIndex}.dayTypes`, selectedValues, {
      shouldValidate: true, // Валидируем сразу
      shouldDirty: true, // Помечаем как измененное
      shouldTouch: true, // Помечаем как тронутое
    });
  };

  /**
   * Добавить новое транспортное средство
   */
  const handleAddVehicle = (): void => {
    appendVehicle({
      id: crypto.randomUUID(),
      model: '',
      capacity: undefined,
    });
  };

  /**
   * Добавить новую остановку
   */
  const handleAddBusStop = (): void => {
    const nextOrderNumber = busStops.length + 1;

    appendStop({
      id: crypto.randomUUID(),
      orderNumber: nextOrderNumber,
      name: '',
      address: '',
      time: { type: 'simple', simpleTime: '' },
      isSpecialNote: false,
    });
  };

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 3,
        mb: 3,
        borderLeft: 6,
        borderColor: period === 'morning' ? 'warning.main' : 'primary.main',
        bgcolor: 'background.paper',
      }}
    >
      {/* Заголовок и управление */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h6"
            color={period === 'morning' ? 'warning.main' : 'primary.main'}
          >
            {period === 'morning'
              ? '🌅 УТРЕННЕЕ РАСПИСАНИЕ'
              : '🌙 ВЕЧЕРНЕЕ РАСПИСАНИЕ'}
          </Typography>

          {/* Статистика */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              size="small"
              icon={<BusIcon />}
              label={`${vehicles.length} ТС`}
              variant="outlined"
            />
            <Chip
              size="small"
              icon={<TimeIcon />}
              label={`${busStops.length} ост.`}
              variant="outlined"
            />
            <Chip
              size="small"
              label={`${dayTypes.length} типа дней`}
              variant="outlined"
              color={dayTypes.length > 0 ? 'success' : 'default'}
            />
          </Box>
        </Box>

        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={onRemove}
          disabled={disabled}
        >
          Удалить расписание
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Тип расписания (утро/вечер) */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Период</InputLabel>
            <Select
              value={period}
              label="Период"
              onChange={(e) => {
                setValue(
                  `schedules.${scheduleIndex}.period`,
                  e.target.value as 'morning' | 'evening',
                  { shouldValidate: true }
                );
              }}
              disabled={disabled}
            >
              <MenuItem value="morning">🌅 Утро</MenuItem>
              <MenuItem value="evening">🌙 Вечер</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Типы дней */}
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            size="small"
            error={hasDayTypesError} // Используем явную проверку
          >
            <InputLabel>Дни действия</InputLabel>
            <Select
              multiple
              value={dayTypes}
              onChange={handleDayTypesChange}
              input={<OutlinedInput label="Дни действия" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={DAY_TYPE_LABELS[value]}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              )}
              disabled={disabled}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 300,
                  },
                },
              }}
            >
              {DAY_TYPES.map((type) => (
                <MenuItem key={type} value={type}>
                  {DAY_TYPE_LABELS[type]}
                </MenuItem>
              ))}
            </Select>
            {/* Показываем ошибку только если нет выбранных дней */}
            {hasDayTypesError && (
              <FormHelperText error>
                {dayTypesError || 'Выберите хотя бы один тип дня'}
              </FormHelperText>
            )}
            {/* Показываем успех, если дни выбраны */}
            {dayTypes.length > 0 && !hasDayTypesError && (
              <FormHelperText sx={{ color: 'success.main' }}>
                ✓ Выбрано типов дней: {dayTypes.length}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        {/* Транспортные средства */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="subtitle1">Транспортные средства</Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddVehicle}
                disabled={disabled}
                sx={{ ml: 'auto' }}
              >
                Добавить ТС
              </Button>
            </Box>

            {vehicleFields.length === 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Добавьте хотя бы одно транспортное средство
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {vehicleFields.map((field, index) => (
                  <Grid item xs={12} key={field.id}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <TextField
                        {...register(
                          `schedules.${scheduleIndex}.vehicles.${index}.model`
                        )}
                        size="small"
                        placeholder="Модель ТС"
                        label="Модель"
                        error={!!scheduleErrors?.vehicles?.[index]?.model}
                        helperText={
                          scheduleErrors?.vehicles?.[index]?.model?.message
                        }
                        disabled={disabled}
                        sx={{ flex: 2 }}
                      />
                      <TextField
                        {...register(
                          `schedules.${scheduleIndex}.vehicles.${index}.capacity`
                        )}
                        size="small"
                        type="number"
                        placeholder="Вместимость"
                        label="Вместимость (опц.)"
                        error={!!scheduleErrors?.vehicles?.[index]?.capacity}
                        helperText={
                          scheduleErrors?.vehicles?.[index]?.capacity?.message
                        }
                        disabled={disabled}
                        sx={{ flex: 1 }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => removeVehicle(index)}
                        disabled={disabled || vehicleFields.length <= 1}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Остановки */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="subtitle1">
                Остановки маршрута <strong>({stopFields.length})</strong>
              </Typography>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={handleAddBusStop}
                disabled={disabled}
                sx={{ ml: 'auto' }}
              >
                Добавить остановку
              </Button>
            </Box>

            {stopFields.length === 0 ? (
              <Alert severity="info">Добавьте хотя бы одну остановку</Alert>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableBody>
                    {stopFields.map((field, index) => (
                      <BusStopRow
                        key={field.id}
                        scheduleIndex={scheduleIndex}
                        stopIndex={index}
                        onRemove={() => removeStop(index)}
                        disabled={disabled}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>

        {/* Примечания */}
        <Grid item xs={12}>
          <TextField
            {...register(`schedules.${scheduleIndex}.notes`)}
            fullWidth
            multiline
            rows={2}
            label="Примечания к расписанию"
            placeholder="Дополнительная информация о расписании"
            disabled={disabled}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
