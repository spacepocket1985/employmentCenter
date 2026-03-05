import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  Grid,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Save as SaveIcon,
  DirectionsBus as BusIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useBusRouteForm } from '@hooks/useBusRouteForm';
import { useCreateBusRouteMutation } from '@store/slices/busRouteApiSlice';

import { UIFormInput } from '@components/ui';
import { LoadingErrorWrapper } from '@components/layout';

import {
  BusRouteFormValues,
  CreateBusRouteDTO,
  SnackbarState,
} from 'src/types/busRoute.types';
import { BusSchedulePanel } from './busSchedulePanel';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

/**
 * Компонент создания маршрута автобуса
 */
export const CreateBusRoutePanel: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  const {
    formMethods,
    schedulesFields,
    addSchedule,
    removeSchedule,
    resetForm,
    isFormValid,
  } = useBusRouteForm();

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = formMethods;

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [createBusRoute, { isLoading: isCreating, error: createError }] =
    useCreateBusRouteMutation();

  /**
   * Проверка возможности сохранения формы
   */
  const canSaveForm = useCallback((): boolean => {
    if (!isFormValid) return false;

    const formValues = formMethods.getValues();

    // Проверяем наличие хотя бы одного расписания
    if (formValues.schedules.length === 0) return false;

    // Проверяем каждое расписание
    return formValues.schedules.every((schedule) => {
      const hasVehicles = schedule.vehicles.length > 0;
      const hasStops = schedule.busStops.length > 0;
      const hasDayTypes = schedule.dayTypes.length > 0;

      return hasVehicles && hasStops && hasDayTypes;
    });
  }, [isFormValid, formMethods]);

  /**
   * Обработчик сохранения формы
   */
  const handleSave = async (formData: BusRouteFormValues): Promise<void> => {
    try {
      // Преобразуем данные для отправки на бэкенд
      const routeData: CreateBusRouteDTO = {
        routeNumber: formData.routeNumber,
        routeName: formData.routeName,
        description: formData.description,
        isActive: formData.isActive,
        schedules: formData.schedules.map((schedule) => ({
          period: schedule.period,
          dayTypes: schedule.dayTypes,
          vehicles: schedule.vehicles.map((v) => ({
            model: v.model,
            capacity: v.capacity,
          })),
          busStops: schedule.busStops.map((stop) => ({
            orderNumber: stop.orderNumber,
            name: stop.name,
            address: stop.address,
            time: stop.time,
            isSpecialNote: stop.isSpecialNote,
          })),
          notes: schedule.notes,
        })),
      };

      await createBusRoute(routeData).unwrap();

      setSnackbar({
        open: true,
        message: `Маршрут №${formData.routeNumber} успешно создан`,
        severity: 'success',
      });

      resetForm();

      // Через 1.5 секунды переходим назад
      setTimeout(() => {
        navigate('/bus-routes');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Ошибка при создании маршрута',
        severity: 'error',
      });
    }
  };

  const handleCancel = (): void => {
    resetForm();
    navigate('/bus-routes');
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const isFormDisabled = isCreating || isSubmitting;
  const routeNumber = watch('routeNumber');

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ maxWidth: 1400, margin: '0 auto', p: 2 }}>
        {/* Заголовок */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <BusIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Создание маршрута {routeNumber && `№${routeNumber}`}
          </Typography>
          <Chip
            label={watch('isActive') ? 'Активный' : 'Неактивный'}
            color={watch('isActive') ? 'success' : 'default'}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>

        <form onSubmit={handleSubmit(handleSave)}>
          {/* Основная информация */}
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Основная информация
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <UIFormInput
                  name="routeNumber"
                  control={formMethods.control}
                  label="Номер маршрута"
                  required
                  disabled={isFormDisabled}
                  textFieldProps={{
                    placeholder: 'Например: 1, 2, 3',
                  }}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <UIFormInput
                  name="routeName"
                  control={formMethods.control}
                  label="Название маршрута (опционально)"
                  disabled={isFormDisabled}
                  textFieldProps={{
                    placeholder: 'Например: Автовокзал - ТЭЦ-2 - ЦТП',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <UIFormInput
                  name="description"
                  control={formMethods.control}
                  label="Описание маршрута"
                  disabled={isFormDisabled}
                  multiline
                  rows={2}
                  textFieldProps={{
                    placeholder: 'Дополнительная информация о маршруте',
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={watch('isActive')}
                      onChange={(e) => setValue('isActive', e.target.checked)}
                      disabled={isFormDisabled}
                    />
                  }
                  label="Маршрут активен"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Расписания */}
          <Paper sx={{ p: 3 }}>
            <LoadingErrorWrapper
              isLoading={isCreating}
              error={createError}
              onRetry={() => {}}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {schedulesFields.map((schedule, index) => (
                    <Tab
                      key={schedule.id}
                      label={`${
                        schedule.period === 'morning' ? '🌅 Утро' : '🌙 Вечер'
                      } ${index + 1}`}
                      icon={<ScheduleIcon />}
                      iconPosition="start"
                    />
                  ))}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => addSchedule('morning')}
                    disabled={isFormDisabled}
                    sx={{ ml: 2, my: 1 }}
                  >
                    Добавить
                  </Button>
                </Tabs>
              </Box>

              {schedulesFields.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{ mt: 3 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => addSchedule('morning')}
                    >
                      Добавить расписание
                    </Button>
                  }
                >
                  <Typography variant="body2">
                    <strong>Нет расписаний</strong> - добавьте утреннее или
                    вечернее расписание
                  </Typography>
                </Alert>
              ) : (
                schedulesFields.map((schedule, index) => (
                  <TabPanel key={schedule.id} value={activeTab} index={index}>
                    <BusSchedulePanel
                      scheduleIndex={index}
                      onRemove={() => removeSchedule(index)}
                      disabled={isFormDisabled}
                    />
                  </TabPanel>
                ))
              )}

              {/* Кнопки действий */}
              <Box
                sx={{
                  mt: 4,
                  display: 'flex',
                  gap: 2,
                  justifyContent: 'flex-end',
                  borderTop: 1,
                  borderColor: 'divider',
                  pt: 3,
                }}
              >
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleCancel}
                  disabled={isFormDisabled}
                  type="button"
                >
                  Отмена
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  type="submit"
                  disabled={isFormDisabled || !canSaveForm()}
                >
                  Создать маршрут
                </Button>
              </Box>
            </LoadingErrorWrapper>
          </Paper>
        </form>

        {/* Уведомления */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </FormProvider>
  );
};
