import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Save as SaveIcon,
  DirectionsBus as BusIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { FormProvider } from 'react-hook-form';

import { useBusRouteForm } from '@hooks/useBusRouteForm';
import {
  useGetBusRouteQuery,
  useUpdateBusRouteMutation,
} from '@store/slices/busRouteApiSlice';
import { UIFormInput } from '@components/ui';
import { LoadingErrorWrapper } from '@components/layout';
import { BusSchedulePanel } from './busSchedulePanel';

import {
  BusRouteFormValues,
  CreateBusRouteDTO,
  SnackbarState,
  BusRouteModel,
} from 'src/types/busRoute.types';

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

export type EditBusRoutePanelProps = {
  id: string;
};

/**
 * Компонент редактирования маршрута автобуса
 * Использует те же хуки и компоненты что и создание
 */
export const EditBusRoutePanel: React.FC<EditBusRoutePanelProps> = ({
  id,
}): JSX.Element => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = React.useState(0);
  const [snackbar, setSnackbar] = React.useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Загрузка данных маршрута
  const {
    data,
    isLoading: isLoadingRoute,
    error: routeError,
  } = useGetBusRouteQuery(id!, {
    skip: !id,
  });

  // Мутация для обновления
  const [updateBusRoute, { isLoading: isUpdating }] =
    useUpdateBusRouteMutation();

  const busRouteData = data?.data;

  // Инициализация формы с данными из API
  const {
    formMethods,
    schedulesFields,
    addSchedule,
    removeSchedule,
    resetForm,
  } = useBusRouteForm();

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = formMethods;

  const isFormDisabled = isUpdating || isSubmitting;
  const routeNumber = watch('routeNumber');
  const isActive = watch('isActive');

  /**
   * Преобразует данные из API в формат формы
   */
  const transformApiDataToForm = (
    apiData: BusRouteModel
  ): BusRouteFormValues => {
    return {
      routeNumber: apiData.routeNumber,
      routeName: apiData.routeName || '',
      schedules: apiData.schedules.map((schedule) => ({
        id: schedule._id || crypto.randomUUID(), // Используем _id из БД или генерируем новый
        period: schedule.period,
        dayTypes: schedule.dayTypes,
        vehicles: schedule.vehicles.map((v) => ({
          id: crypto.randomUUID(), // Клиентский ID для React
          model: v.model,
          capacity: v.capacity,
        })),
        busStops: schedule.busStops.map((stop) => ({
          id: crypto.randomUUID(), // Клиентский ID для React
          orderNumber: stop.orderNumber,
          name: stop.name,
          address: stop.address || '',
          time: stop.time,
          isSpecialNote: stop.isSpecialNote || false,
        })),
        notes: schedule.notes || '',
      })),
      isActive: apiData.isActive,
    };
  };

  // Заполняем форму данными после загрузки
  useEffect(() => {
    if (busRouteData) {
      const formData = transformApiDataToForm(busRouteData);
      reset(formData);
    }
  }, [busRouteData, reset]);

  /**
   * Преобразует данные формы в формат для API
   */
  const transformFormToApiData = (
    formData: BusRouteFormValues
  ): CreateBusRouteDTO => {
    return {
      routeNumber: formData.routeNumber,
      routeName: formData.routeName || undefined,
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
        notes: schedule.notes || undefined,
      })),
    };
  };

  /**
   * Обработчик сохранения изменений
   */
  const handleSave = async (formData: BusRouteFormValues): Promise<void> => {
    if (!id) return;

    try {
      const routeData = transformFormToApiData(formData);

      await updateBusRoute({ id, data: routeData }).unwrap();

      setSnackbar({
        open: true,
        message: `Маршрут №${formData.routeNumber} успешно обновлен`,
        severity: 'success',
      });

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Ошибка при обновлении маршрута',
        severity: 'error',
      });
    }
  };

  /**
   * Обработчик отмены
   */
  const handleCancel = (): void => {
    resetForm();
    navigate('/bus-routes');
  };

  /**
   * Закрыть уведомление
   */
  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  /**
   * Добавить новое расписание
   */
  const handleAddSchedule = (): void => {
    addSchedule('morning');
    setTimeout(() => {
      setActiveTab(schedulesFields.length);
    }, 0);
  };

  /**
   * Удалить расписание
   */
  const handleRemoveSchedule = (index: number): void => {
    removeSchedule(index);
    setTimeout(() => {
      if (index === schedulesFields.length - 1 && index > 0) {
        setActiveTab(index - 1);
      } else if (index === 0 && schedulesFields.length > 1) {
        setActiveTab(0);
      }
    }, 0);
  };

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ maxWidth: 1400, margin: '0 auto', p: 2 }}>
        {/* Заголовок */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <BusIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Редактирование маршрута {routeNumber && `№${routeNumber}`}
          </Typography>
          <Chip
            label={isActive ? 'Активный' : 'Неактивный'}
            color={isActive ? 'success' : 'default'}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>

        <LoadingErrorWrapper isLoading={isLoadingRoute} error={routeError}>
          <form onSubmit={handleSubmit(handleSave)}>
            {/* Основная информация */}
            <Paper sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Основная информация
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
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

                <Grid item xs={12} md={7}>
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

                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isActive}
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
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={(_, newValue) => setActiveTab(newValue)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ minHeight: 48 }}
                >
                  {schedulesFields.map((schedule, index) => (
                    <Tab
                      key={schedule.id}
                      label={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          {schedule.period === 'morning' ? '🌅' : '🌙'}
                          <span>Расписание {index + 1}</span>
                          {schedule.dayTypes.length > 0 && (
                            <Chip
                              size="small"
                              label={schedule.dayTypes.length}
                              color="primary"
                              variant="outlined"
                              sx={{
                                ml: 0.5,
                                height: 20,
                                '& .MuiChip-label': { px: 0.5 },
                              }}
                            />
                          )}
                        </Box>
                      }
                      icon={<ScheduleIcon />}
                      iconPosition="start"
                      sx={{ minHeight: 48 }}
                    />
                  ))}
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<ScheduleIcon />}
                    onClick={handleAddSchedule}
                    disabled={isFormDisabled}
                    sx={{ ml: 2, my: 1 }}
                  >
                    Добавить расписание
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
                      onClick={handleAddSchedule}
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
                      onRemove={() => handleRemoveSchedule(index)}
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
                  disabled={isFormDisabled}
                >
                  Сохранить изменения
                </Button>
              </Box>
            </Paper>
          </form>
        </LoadingErrorWrapper>

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
