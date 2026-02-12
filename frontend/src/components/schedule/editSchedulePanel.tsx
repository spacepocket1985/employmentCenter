import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
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
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Хуки и утилиты
import { useScheduleForm } from '@hooks/useScheduleForm';

import {
  useGetScheduleQuery,
  useUpdateScheduleMutation,
} from '@store/slices/scheduleApiSlice';
import { parseScheduleDate } from '@utils/scheduleDateUtils';

// Компоненты
import MonthSelector from './monthSelector';
import ScheduleEntryRow from './scheduleEntryRow';
import ScheduleTypeSelector from './scheduleTypeSelector';

// UI компоненты
import { LoadingErrorWrapper } from '@components/layout';
import { UITitle } from '@components/ui';

// Типы
import {
  ScheduleFormValues,
  ScheduleModel,
  SnackbarState,
  EditSchedulePanelProps,
  ScheduleEntryUpdateExisting,
  ScheduleEntryUpdateNew,
  ScheduleUpdateModel,
} from 'src/types/schedule.types';

/**
 * Компонент редактирования существующего графика дежурств
 */
const EditSchedulePanel: React.FC<EditSchedulePanelProps> = ({
  scheduleId,
  onSuccess,
  onCancel,
}): JSX.Element => {
  const navigate = useNavigate();

  // ===== Состояния =====
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Флаг для однократной загрузки данных
  const isFormPopulated = useRef(false);

  // ===== RTK Query хуки =====
  const {
    data: scheduleResponse,
    isLoading: isLoadingSchedule,
    error: scheduleError,
    refetch: refetchSchedule,
  } = useGetScheduleQuery(scheduleId, {
    skip: !scheduleId,
    refetchOnMountOrArgChange: true,
  });

  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateScheduleMutation();

  // ===== Хук формы с валидацией =====
  const {
    formMethods,
    monthOptions,
    fields,
    appendEntry,
    removeEntry,
    loadFormData,
  } = useScheduleForm();

  const {
    handleSubmit,
    watch,
    formState: { isValid, errors },
    getValues,

    trigger,
  } = formMethods;

  // Получаем значения полей формы
  const [month, scheduleType] = watch(['month', 'scheduleType']);

  // ===== Заполняем форму данными из API (только один раз) =====
  const scheduleData: ScheduleModel | undefined = scheduleResponse?.data;

  // Сбрасываем флаг при изменении ID
  useEffect(() => {
    isFormPopulated.current = false;
  }, [scheduleId]);

  // Загружаем данные с защитой от повторной загрузки
  useEffect(() => {
    if (isLoadingSchedule || !scheduleData || isFormPopulated.current) {
      return;
    }

    // Преобразуем данные из API в формат формы
    const entries = scheduleData.entries.map((entry) => {
      let employeeId: string | undefined = undefined;
      if (entry.employeeId) {
        if (typeof entry.employeeId === 'object' && '_id' in entry.employeeId) {
          employeeId = entry.employeeId._id;
        } else if (typeof entry.employeeId === 'string') {
          employeeId = entry.employeeId;
        }
      }

      return {
        id: entry._id,
        employeeId,
        customName: entry.customName || '',
        customJob: entry.customJob || '',
        dates: [...entry.dates].sort(),
        orderIndex: entry.orderIndex,
      };
    });

    const formData: ScheduleFormValues = {
      month: scheduleData.month,
      scheduleType: scheduleData.scheduleType,
      entries,
    };

    // Загружаем данные в форму
    loadFormData(formData);
    isFormPopulated.current = true;

    // Валидируем после загрузки
    setTimeout(() => {
      trigger();
    }, 0);
  }, [scheduleData, isLoadingSchedule, loadFormData, trigger, scheduleId]);

  // ===== Мемоизированные значения =====
  const parsedMonth = useMemo(() => {
    if (!month) return null;
    return parseScheduleDate(month);
  }, [month]);

  const monthDisplayName = useMemo(() => {
    if (!parsedMonth) return '';
    return `${parsedMonth.month} ${parsedMonth.year}`;
  }, [parsedMonth]);

  // ===== Обработчики =====
  /**
   * Проверка, можно ли сохранять изменения
   */
  const canSaveForm = useCallback((): boolean => {
    if (!isValid) {
      console.log('❌ Форма невалидна:', errors);
      return false;
    }

    if (!month || !scheduleType) {
      console.log('❌ Не выбран месяц или тип графика');
      return false;
    }

    if (fields.length === 0) {
      console.log('❌ Нет записей');
      return false;
    }

    const entries = getValues('entries');

    const allEntriesValid = entries.every((entry) => {
      const hasDates =
        entry.dates && Array.isArray(entry.dates) && entry.dates.length > 0;
      const hasName = entry.customName?.trim().length > 0;
      const hasJob = entry.customJob?.trim().length > 0;
      const hasId = !!entry.id;

      return hasDates && hasName && hasJob && hasId;
    });

    return allEntriesValid;
  }, [isValid, month, scheduleType, fields.length, getValues, errors]);

// В handleSave, при обновлении графика
const handleSave = async (formData: ScheduleFormValues): Promise<void> => {
  if (!scheduleId) {
    setSnackbar({
      open: true,
      message: 'Ошибка: ID графика не найден',
      severity: 'error',
    });
    return;
  }

  try {
    // Разделяем существующие и новые записи
    const existingEntries = formData.entries.filter(entry => 
      !entry.id.startsWith('manual-') && !entry.id.startsWith('template-')
    );
    
    const newEntries = formData.entries.filter(entry => 
      entry.id.startsWith('manual-') || entry.id.startsWith('template-')
    );

    // Создаем массив записей для обновления с правильными типами
    const entriesToUpdate: (ScheduleEntryUpdateExisting | ScheduleEntryUpdateNew)[] = [
      // Существующие записи - с _id
      ...existingEntries.map((entry, index) => ({
        _id: entry.id,
        customName: entry.customName,
        customJob: entry.customJob,
        dates: [...entry.dates].sort(),
        orderIndex: index,
        ...(entry.employeeId && { employeeId: entry.employeeId }),
      })),
      // Новые записи - без _id
      ...newEntries.map((entry, index) => ({
        customName: entry.customName,
        customJob: entry.customJob,
        dates: [...entry.dates].sort(),
        orderIndex: existingEntries.length + index,
        ...(entry.employeeId && { employeeId: entry.employeeId }),
      })),
    ];

    const updateData: ScheduleUpdateModel = {
      entries: entriesToUpdate,
      notes: scheduleData?.notes || '',
    };

    console.log('📤 Отправка обновленных данных:', updateData);

    await updateSchedule({
      id: scheduleId,
      data: updateData,
    }).unwrap();

    setSnackbar({
      open: true,
      message: 'График успешно обновлен',
      severity: 'success',
    });

    if (onSuccess) {
      onSuccess();
    }

    setTimeout(() => {
      navigate('/staff/schedules/');
    }, 1500);
  } catch (error: unknown) {
    console.error('❌ Ошибка при обновлении графика:', error);

    let errorMessage = 'Ошибка при обновлении графика';
    if (error && typeof error === 'object' && 'data' in error) {
      const apiError = error as { data?: { message?: string } };
      errorMessage = apiError.data?.message || errorMessage;
    }

    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error',
    });
  }
};

  /**
   * Обработчик отмены
   */
  const handleCancel = (): void => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('./');
    }
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

  /**
   * Обработчик закрытия снекбара
   */
  const handleCloseSnackbar = (): void => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  /**
   * Обработчик повторной загрузки
   */
  const handleRetry = (): void => {
    isFormPopulated.current = false;
    refetchSchedule();
  };

  const isLoading = isLoadingSchedule || isUpdating;

  return (
    <FormProvider {...formMethods}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 2 }}>
        {/* Заголовок */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
            Редактирование графика дежурств
          </Typography>

          {scheduleData && monthDisplayName && (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                bgcolor: 'primary.light',
                color: 'primary.contrastText',
                borderRadius: 2,
              }}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                {`Редактирование: ${monthDisplayName}`}
              </Typography>
            </Paper>
          )}
        </Box>

        <form onSubmit={handleSubmit(handleSave)}>
          <Paper sx={{ p: 3, mb: 0.5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 2,
              }}
            >
              {/* Месяц (отключен) */}
              <Box sx={{ flex: 1 }}>
                <MonthSelector monthOptions={monthOptions} disabled={true} />
                <Typography variant="caption" color="text.secondary">
                  * Месяц графика не может быть изменен
                </Typography>
              </Box>

              {/* Тип графика (отключен) */}
              <Box sx={{ flex: 1 }}>
                <ScheduleTypeSelector disabled={true} />
                <Typography variant="caption" color="text.secondary">
                  * Тип графика не может быть изменен
                </Typography>
              </Box>

              {/* Информация */}
              <Box sx={{ flex: 1 }}>
                <Box sx={{ bgcolor: 'grey.50', borderRadius: 1, p: 1.5 }}>
                  <UITitle>Информация о графике:</UITitle>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Дата создания:{' '}
                    {scheduleData?.createdAt
                      ? new Date(scheduleData.createdAt).toLocaleDateString(
                          'ru-RU'
                        )
                      : 'Не указана'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                    sx={{ mt: 0.5 }}
                  >
                    • Количество записей: {fields.length}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="left"
                  >
                    • Вы можете добавлять/удалять строки и редактировать даты
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, mt: 0.5 }}>
            <LoadingErrorWrapper
              isLoading={isLoadingSchedule}
              error={scheduleError}
              onRetry={handleRetry}
              collectionTitle="график"
              isCollectionObject={true}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" component="span">
                    Список дежурств
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="span"
                    sx={{ ml: 1 }}
                  >
                    ({fields.length} строк)
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleAddEmptyEntry}
                  disabled={isLoading}
                  type="button"
                  size="small"
                >
                  Добавить строку
                </Button>
              </Box>

              {fields.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  В графике нет записей. Добавьте новую строку для продолжения.
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
                            disabled={isLoading}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

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
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      disabled={isLoading}
                      type="button"
                    >
                      Отмена
                    </Button>

                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={
                        isUpdating ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <SaveIcon />
                        )
                      }
                      type="submit"
                      disabled={isLoading || !canSaveForm()}
                    >
                      {isUpdating ? 'Сохранение...' : 'Сохранить изменения'}
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

export default EditSchedulePanel;
