import React, { useState, useEffect } from 'react';
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
  Grid,
} from '@mui/material';
import { Add as AddIcon, Save as SaveIcon } from '@mui/icons-material';
import { useScheduleForm } from '@hooks/useScheduleForm';
import {
  useGetResponsibleOnWeekendsQuery,
  useGetSafetyOfficersQuery,
  useGetScheduleByMonthAndTypeQuery,
  useCreateScheduleMutation,
} from '@store/slices/scheduleApiSlice';

import LoadingErrorWrapper from './loadingErrorWrapper';
import MonthSelector from './monthSelector';
import ScheduleEntryRow from './scheduleEntryRow';
import ScheduleTypeSelector from './scheduleTypeSelector';

/**
 * Компонент создания графика дежурств
 * Позволяет выбрать месяц и тип графика, автоматически заполнить
 * список сотрудников, добавить даты дежурств и сохранить график
 */
const CreateSchedulePanel: React.FC = () => {
  // Хук для управления формой графика
  const {
    formData,
    validationErrors,
    monthOptions,
    updateMonth,
    updateScheduleType,
    autoFillFromEmployees,
    addEmptyEntry,
    updateEntry,
    removeEntry,
    addDateToEntry,
    removeDateFromEntry,
    validateForm,
    resetForm,
  } = useScheduleForm();

  // Состояние снекбара для уведомлений
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // Проверка существования графика на выбранный месяц
  const {
    data: existingSchedule,
    isLoading: isLoadingExisting,
    refetch: refetchExisting,
  } = useGetScheduleByMonthAndTypeQuery(
    {
      month: formData.month,
      scheduleType: formData.scheduleType,
    },
    { skip: !formData.month }
  );

  // Получение списка ответственных на выходных
  const {
    data: responsibleData,
    isLoading: isLoadingResponsible,
    refetch: refetchResponsible,
  } = useGetResponsibleOnWeekendsQuery(undefined, {
    skip: formData.scheduleType !== 'responsibleOnWeekends',
  });

  // Получение списка сотрудников охраны труда
  const {
    data: safetyData,
    isLoading: isLoadingSafety,
    refetch: refetchSafety,
  } = useGetSafetyOfficersQuery(undefined, {
    skip: formData.scheduleType !== 'safetyOfficers',
  });

  // Мутация для создания графика
  const [createSchedule, { isLoading: isCreating, error: createError }] =
    useCreateScheduleMutation();

  /**
   * Автоматическое заполнение формы при изменении типа графика
   * или получении данных о сотрудниках
   */
  useEffect(() => {
    if (
      formData.scheduleType === 'responsibleOnWeekends' &&
      responsibleData?.data
    ) {
      autoFillFromEmployees(responsibleData.data);
    } else if (formData.scheduleType === 'safetyOfficers' && safetyData?.data) {
      autoFillFromEmployees(safetyData.data);
    }
  }, [
    formData.scheduleType,
    responsibleData,
    safetyData,
    autoFillFromEmployees,
  ]);

  /**
   * Обработчик сохранения графика
   * Выполняет валидацию формы и отправку данных на сервер
   */
  const handleSave = async () => {
    // Валидация формы
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Исправьте ошибки в форме перед сохранением',
        severity: 'error',
      });
      return;
    }

    // Проверка существующего графика
    if (existingSchedule?.data) {
      setSnackbar({
        open: true,
        message: `График на ${formData.month} (${formData.scheduleType}) уже существует`,
        severity: 'warning',
      });
      return;
    }

    try {
      // Подготовка данных для отправки
      const scheduleData = {
        month: formData.month,
        scheduleType: formData.scheduleType,
        entries: formData.entries.map((entry) => ({
          employeeId: entry.employeeId,
          customName: entry.customName,
          customJob: entry.customJob,
          dates: entry.dates,
          orderIndex: entry.orderIndex,
        })),
      };

      // Отправка запроса на создание графика
      await createSchedule(scheduleData).unwrap();

      // Успешное сохранение
      setSnackbar({
        open: true,
        message: 'График успешно создан',
        severity: 'success',
      });

      // Сброс формы
      resetForm();
    } catch (error) {
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
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Состояние загрузки
  const isLoading =
    isLoadingExisting || isLoadingResponsible || isLoadingSafety || isCreating;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Создание графика дежурств
      </Typography>

      <Grid container spacing={3}>
        {/* Левая колонка: Настройки графика */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            {/* Выбор месяца */}
            <MonthSelector
              month={formData.month}
              monthOptions={monthOptions}
              onChange={updateMonth}
              error={validationErrors.month}
              disabled={isLoading}
            />

            {/* Выбор типа графика */}
            <ScheduleTypeSelector
              scheduleType={formData.scheduleType}
              onChange={updateScheduleType}
              error={validationErrors.scheduleType}
              disabled={isLoading}
            />

            {/* Предупреждение о существующем графике */}
            {existingSchedule?.data && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Внимание: график на {formData.month} уже существует
              </Alert>
            )}

            {/* Информация о текущем состоянии */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                Информация:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • При выборе типа графика форма автоматически заполнится
                сотрудниками
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Для добавления дат используйте поле ввода в формате ГГГГ-ММ-ДД
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Вы можете добавлять новые строки или редактировать
                существующие
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка: Таблица графика */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <LoadingErrorWrapper
              isLoading={isLoading}
              error={createError}
              onRetry={() => {
                refetchExisting();
                if (formData.scheduleType === 'responsibleOnWeekends') {
                  refetchResponsible();
                } else {
                  refetchSafety();
                }
              }}
            >
              {/* Заголовок таблицы */}
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}
              >
                <Typography variant="h6">
                  Список дежурств ({formData.entries.length} строк)
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={addEmptyEntry}
                  disabled={isLoading}
                >
                  Добавить строку
                </Button>
              </Box>

              {/* Сообщение при пустой таблице */}
              {formData.entries.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                  Выберите тип графика для автоматического заполнения
                  сотрудниками
                </Alert>
              ) : (
                <>
                  {/* Таблица с записями */}
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell width="50">№</TableCell>
                          <TableCell>Ф.И.О.</TableCell>
                          <TableCell>Должность</TableCell>
                          <TableCell>Даты дежурств</TableCell>
                          <TableCell width="80">Действия</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {formData.entries.map((entry, index) => (
                          <ScheduleEntryRow
                            key={entry.id}
                            entry={entry}
                            index={index}
                            onUpdate={(updates) =>
                              updateEntry(entry.id, updates)
                            }
                            onRemove={() => removeEntry(entry.id)}
                            onAddDate={(date) => addDateToEntry(entry.id, date)}
                            onRemoveDate={(date) =>
                              removeDateFromEntry(entry.id, date)
                            }
                            errors={validationErrors.entries?.[entry.id]}
                            disabled={isLoading || !formData.month} // Блокируем если не выбран месяц
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Кнопки управления */}
                  {formData.entries.length > 0 && (
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
                      >
                        Отмена
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isLoading || !!existingSchedule?.data}
                      >
                        Сохранить график
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </LoadingErrorWrapper>
          </Paper>
        </Grid>
      </Grid>

      {/* Снекбар для уведомлений */}
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
  );
};

export default CreateSchedulePanel;
