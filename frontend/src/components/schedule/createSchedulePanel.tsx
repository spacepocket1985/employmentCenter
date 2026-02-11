import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { ScheduleFormValues } from '@utils/scheduleValidationSchema';
import { LoadingErrorWrapper } from '@components/layout';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

/**
 * Компонент создания графика дежурств
 */
const CreateSchedulePanel: React.FC = (): JSX.Element => {
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

  // Получаем значения полей формы
  const [month, scheduleType] = watch(['month', 'scheduleType']);

  console.log('Current scheduleType:', scheduleType); // Для отладки

  // Используем мемоизацию для параметров запроса существующего графика
  const scheduleQueryParams = useMemo(
    () => ({
      month,
      scheduleType,
    }),
    [month, scheduleType]
  );

  // Проверка существования графика на выбранный месяц - только если выбран и месяц, и тип
  const {
    data: existingSchedule,
    isLoading: isLoadingExisting,
    refetch: refetchExisting,
  } = useGetScheduleByMonthAndTypeQuery(scheduleQueryParams, {
    skip: !month || !scheduleType, // Пропускаем запрос, если не выбран месяц или тип
  });

  // Получение списка ответственных на выходных - только при активном типе
  const {
    data: responsibleData,
    isLoading: isLoadingResponsible,
    refetch: refetchResponsible,
  } = useGetResponsibleOnWeekendsQuery(undefined, {
    skip: scheduleType !== 'responsibleOnWeekends', // Пропускаем, если не выбран соответствующий тип
    refetchOnMountOrArgChange: false,
  });

  // Получение списка сотрудников охраны труда - только при активном типе
  const {
    data: safetyData,
    isLoading: isLoadingSafety,
    refetch: refetchSafety,
  } = useGetSafetyOfficersQuery(undefined, {
    skip: scheduleType !== 'safetyOfficers', // Пропускаем, если не выбран соответствующий тип
    refetchOnMountOrArgChange: false,
  });

  // Мутация для создания графика
  const [createSchedule, { isLoading: isCreating, error: createError }] =
    useCreateScheduleMutation();

  /**
   * Сброс записей при изменении типа графика
   * Очищаем форму перед автоматическим заполнением
   */
  useEffect((): void => {
    if (scheduleType) {
      console.log('Schedule type changed to:', scheduleType);
      // Очищаем записи при смене типа
      setValue('entries', [], { shouldValidate: true });
    }
  }, [scheduleType, setValue]);

  /**
   * Автоматическое заполнение формы при изменении типа графика
   */
  useEffect((): void => {
    // Заполняем только если выбран тип и есть данные
    if (scheduleType === 'responsibleOnWeekends' && responsibleData?.data) {
      console.log('Auto-filling with responsible data');
      autoFillFromEmployees(responsibleData.data);
    } else if (scheduleType === 'safetyOfficers' && safetyData?.data) {
      console.log('Auto-filling with safety data');
      autoFillFromEmployees(safetyData.data);
    }
  }, [scheduleType, responsibleData, safetyData, autoFillFromEmployees]);

  /**
   * Проверка, можно ли сохранять форму
   */
  const canSaveForm = useCallback((): boolean => {
    // Форма должна быть валидной
    if (!isValid) return false;

    // Должны быть заполнены основные поля
    if (!month || !scheduleType) return false;

    // Должны быть записи
    if (fields.length === 0) return false;

    // Не должно быть существующего графика
    if (existingSchedule?.data) return false;

    // Все записи должны иметь хотя бы одну дату
    const entries = formMethods.getValues('entries');
    const allEntriesHaveDates = entries.every(
      (entry) => entry.dates && entry.dates.length > 0
    );

    // Все записи должны иметь заполненные ФИО и должность
    const allEntriesHaveNamesAndJobs = entries.every(
      (entry) => entry.customName?.trim() && entry.customJob?.trim()
    );

    return allEntriesHaveDates && allEntriesHaveNamesAndJobs;
  }, [
    isValid,
    month,
    scheduleType,
    fields.length,
    existingSchedule?.data,
    formMethods,
  ]);

  /**
   * Обработчик сохранения графика
   */
  const handleSave = async (formData: ScheduleFormValues): Promise<void> => {
    if (!formData.scheduleType) {
      setSnackbar({
        open: true,
        message: 'Не выбран тип графика',
        severity: 'warning',
      });
      return;
    }

    if (existingSchedule?.data) {
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
          employeeId: entry.employeeId,
          customName: entry.customName,
          customJob: entry.customJob,
          dates: entry.dates,
          orderIndex: index,
        })),
      };

      console.log('Sending schedule data:', scheduleData);

      await createSchedule(scheduleData).unwrap();

      setSnackbar({
        open: true,
        message: 'График успешно создан',
        severity: 'success',
      });

      resetForm();
    } catch (error: unknown) {
      console.error('Ошибка при сохранении графика:', error);
      setSnackbar({
        open: true,
        message: 'Ошибка при сохранении графика',
        severity: 'error',
      });
    }
  };

  /**
   * Обработчик закрытия снекбара
   */
  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  /**
   * Обработчик добавления пустой строки
   */
  const handleAddEmptyEntry = (): void => {
    appendEntry({
      customName: '',
      customJob: '',
      dates: [],
      orderIndex: fields.length,
    });
  };

  const isLoading: boolean =
    isLoadingExisting || isLoadingResponsible || isLoadingSafety || isCreating;

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
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                }}
              >
                {existingSchedule?.data && (
                  <Alert severity="warning" sx={{ mb: 1 }}>
                    Внимание: график на {month} ({scheduleType}) уже существует
                  </Alert>
                )}

                {/* Информационный блок */}
                <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1.5 }}>
                  <UITitle>Информация:</UITitle>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Выберите месяц
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • При выборе типа графика форма автоматически заполнится
                    сотрудниками
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Для добавления дат используйте календарь
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Вы можете добавлять новые строки или редактировать
                    существующие
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <LoadingErrorWrapper
              isLoading={isLoading}
              error={createError}
              onRetry={(): void => {
                refetchExisting();
                if (scheduleType === 'responsibleOnWeekends') {
                  refetchResponsible();
                } else if (scheduleType === 'safetyOfficers') {
                  refetchSafety();
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
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
                  disabled={isLoading || !month || !scheduleType}
                  type="button"
                >
                  Добавить строку
                </Button>
              </Box>

              {fields.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  {!scheduleType
                    ? 'Выберите тип графика для автоматического заполнения сотрудниками'
                    : 'Загрузка данных...'}
                </Alert>
              ) : (
                <>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width="50">№</TableCell>
                          <TableCell width="35%">Ф.И.О.</TableCell>
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
                            onRemove={(): void => removeEntry(index)}
                            disabled={isLoading || !month}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {fields.length > 0 && (
                    <Box
                      sx={{
                        mt: 3,
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={resetForm}
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
                  )}
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
