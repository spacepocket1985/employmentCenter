import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useScheduleForm } from '@hooks/useScheduleForm';
import {
  useGetResponsibleOnWeekendsQuery,
  useGetSafetyOfficersQuery,
  useGetScheduleByMonthAndTypeQuery,
  useCreateScheduleMutation,
} from '@store/slices/scheduleApiSlice';
import MonthSelector from './monthSelector';
import ScheduleEntryRow from './scheduleEntryRow';
import ScheduleTypeSelector from './scheduleTypeSelector';
import { UITitle } from '@components/ui';
import { ScheduleFormValues, SnackbarState } from 'src/types/schedule.types';
import { LoadingErrorWrapper } from '@components/layout';

/**
 * Компонент создания графика дежурств
 */
const CreateSchedulePanel: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const {
    formMethods,
    monthOptions,
    fields,
    appendEntry,
    removeEntry,
    autoFillFromEmployees,
    resetForm,
  } = useScheduleForm();

  const {
    handleSubmit,
    watch,
    formState: { isValid },
    setValue,
  } = formMethods;

  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  const [month, scheduleType] = watch(['month', 'scheduleType']);

  // Состояние для отслеживания существования графика
  const [scheduleExists, setScheduleExists] = useState<{
    exists: boolean;
    month: string;
    scheduleType: string;
  }>({
    exists: false,
    month: '',
    scheduleType: '',
  });

  // Сбрасываем состояние при изменении месяца или типа
  useEffect(() => {
    setScheduleExists({
      exists: false,
      month: '',
      scheduleType: '',
    });
  }, [month, scheduleType]);

  const shouldSkipQuery = !month || !scheduleType;

  const {
    isLoading: isLoadingExisting,
    refetch: refetchExisting,
    isFetching,
    isSuccess,
    currentData, // Используем currentData вместо data для получения актуальных данных
  } = useGetScheduleByMonthAndTypeQuery(
    { month, scheduleType },
    {
      skip: shouldSkipQuery,
      // Не используем кэш для этого запроса
      refetchOnMountOrArgChange: true,
    }
  );

  // Обновляем состояние существования графика только когда получаем актуальные данные
  useEffect(() => {
    if (!shouldSkipQuery && !isFetching && isSuccess) {
      const exists = !!currentData?.data;
      setScheduleExists({
        exists,
        month,
        scheduleType,
      });
    }
  }, [
    currentData,
    isFetching,
    isSuccess,
    shouldSkipQuery,
    month,
    scheduleType,
  ]);

  const {
    data: responsibleData,
    isLoading: isLoadingResponsible,
    refetch: refetchResponsible,
  } = useGetResponsibleOnWeekendsQuery(undefined, {
    skip: scheduleType !== 'responsibleOnWeekends',
  });

  const {
    data: safetyData,
    isLoading: isLoadingSafety,
    refetch: refetchSafety,
  } = useGetSafetyOfficersQuery(undefined, {
    skip: scheduleType !== 'safetyOfficers',
  });

  const [createSchedule, { isLoading: isCreating, error: createError }] =
    useCreateScheduleMutation();

  // Сброс записей при изменении типа графика
  useEffect(() => {
    if (scheduleType) {
      setValue('entries', [], { shouldValidate: true });
    }
  }, [scheduleType, setValue]);

  // Автоматическое заполнение формы
  useEffect(() => {
    if (scheduleType === 'responsibleOnWeekends' && responsibleData?.data) {
      autoFillFromEmployees(responsibleData.data);
    } else if (scheduleType === 'safetyOfficers' && safetyData?.data) {
      autoFillFromEmployees(safetyData.data);
    }
  }, [scheduleType, responsibleData, safetyData, autoFillFromEmployees]);

  const canSaveForm = useCallback((): boolean => {
    if (!isValid) return false;
    if (!month || !scheduleType) return false;
    if (fields.length === 0) return false;
    if (scheduleExists.exists) return false;

    const entries = formMethods.getValues('entries');
    const allEntriesHaveDates = entries.every(
      (entry) => entry.dates && entry.dates.length > 0
    );
    const allEntriesHaveNamesAndJobs = entries.every(
      (entry) => entry.customName?.trim() && entry.customJob?.trim()
    );

    return allEntriesHaveDates && allEntriesHaveNamesAndJobs;
  }, [
    isValid,
    month,
    scheduleType,
    fields.length,
    scheduleExists.exists,
    formMethods,
  ]);

  const handleSave = async (formData: ScheduleFormValues): Promise<void> => {
    if (!formData.scheduleType) {
      setSnackbar({
        open: true,
        message: 'Не выбран тип графика',
        severity: 'warning',
      });
      return;
    }

    if (scheduleExists.exists) {
      setSnackbar({
        open: true,
        message: `График на ${month} (${formData.scheduleType}) уже существует`,
        severity: 'warning',
      });
      return;
    }

    try {
      const scheduleData = {
        month: formData.month,
        scheduleType: formData.scheduleType,
        entries: formData.entries.map((entry, index) => ({
          customName: entry.customName,
          customJob: entry.customJob,
          dates: [...entry.dates].sort(),
          orderIndex: index,
          employeeId: entry.employeeId,
        })),
      };

      await createSchedule(scheduleData).unwrap();

      setSnackbar({
        open: true,
        message: 'График успешно создан',
        severity: 'success',
      });

      resetForm();

      setTimeout(() => {
        navigate('/staff/schedules');
      }, 1500);
    } catch {
      setSnackbar({
        open: true,
        message: 'Ошибка при сохранении графика',
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddEmptyEntry = (): void => {
    appendEntry({
      customName: '',
      customJob: '',
      dates: [],
      orderIndex: fields.length,
    });
  };

  const handleCancel = (): void => {
    resetForm();
    navigate('/schedule/list');
  };

  const handleRetry = (): void => {
    refetchExisting();
    if (scheduleType === 'responsibleOnWeekends') {
      refetchResponsible();
    } else if (scheduleType === 'safetyOfficers') {
      refetchSafety();
    }
  };

  const isLoading =
    isLoadingExisting ||
    isLoadingResponsible ||
    isLoadingSafety ||
    isCreating ||
    isFetching;
  const isFormDisabled =
    isLoading || !month || !scheduleType || scheduleExists.exists;

  // Определяем нужно ли показывать предупреждение
  const showWarning =
    scheduleExists.exists &&
    scheduleExists.month === month &&
    scheduleExists.scheduleType === scheduleType;

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Создание графика дежурств
        </Typography>

        <form onSubmit={handleSubmit(handleSave)}>
          <Paper sx={{ p: 3, mb: 0.5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <MonthSelector
                  monthOptions={monthOptions}
                  disabled={isLoading}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <ScheduleTypeSelector disabled={isLoading} />
              </Box>

              <Box sx={{ flex: 1 }}>
                {showWarning && (
                  <Alert
                    severity="warning"
                    sx={{ mb: 1 }}
                    onClose={() =>
                      setScheduleExists((prev) => ({ ...prev, exists: false }))
                    }
                  >
                    <Typography variant="body2">
                      <strong>Внимание!</strong> График на {month} (
                      {scheduleType === 'responsibleOnWeekends'
                        ? 'Дежурства на выходных'
                        : 'Проверки охраны труда'}
                      ) уже существует.
                    </Typography>
                  </Alert>
                )}

                <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1.5 }}>
                  <UITitle>Информация:</UITitle>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Выберите месяц и тип графика
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • При выборе типа форма заполнится сотрудниками
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Для добавления дат используйте календарь
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 0.5 }}>
            <LoadingErrorWrapper
              isLoading={isLoading}
              error={createError}
              onRetry={handleRetry}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6">
                  Список дежурств ({fields.length} строк)
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddEmptyEntry}
                  disabled={isFormDisabled}
                  type="button"
                  size="small"
                >
                  Добавить строку
                </Button>
              </Box>

              {fields.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  {!scheduleType
                    ? 'Выберите тип графика для автоматического заполнения'
                    : 'Загрузка данных...'}
                </Alert>
              ) : (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width="50">№</TableCell>
                          <TableCell width="30%">Ф.И.О.</TableCell>
                          <TableCell width="25%">Должность</TableCell>
                          <TableCell>Даты дежурств</TableCell>
                          <TableCell width="80">Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((field, index) => (
                          <ScheduleEntryRow
                            key={field.id}
                            index={index}
                            onRemove={() => removeEntry(index)}
                            disabled={isFormDisabled}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

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
                      disabled={isLoading}
                      type="button"
                    >
                      Отмена
                    </Button>

                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      type="submit"
                      disabled={isLoading || !canSaveForm()}
                    >
                      Сохранить график
                    </Button>
                  </Box>
                </>
              )}
            </LoadingErrorWrapper>
          </Paper>
        </form>

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

export default CreateSchedulePanel;
