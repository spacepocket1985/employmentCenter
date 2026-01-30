// components/schedule/CreateSchedulePanel.tsx

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
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useScheduleForm } from '@hooks/useScheduleForm';
import {
  useGetResponsibleOnWeekendsQuery,
  useGetSafetyOfficersQuery,
  useGetScheduleByMonthAndTypeQuery,
  useCreateScheduleMutation,
  useCreateScheduleFromTemplateMutation,
} from '@store/slices/scheduleApiSlice';
import LoadingErrorWrapper from './loadingErrorWrapper';
import MonthSelector from './monthSelector';
import ScheduleEntryRow from './scheduleEntryRow';
import ScheduleTypeSelector from './scheduleTypeSelector';


const CreateSchedulePanel: React.FC = () => {
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

  // Проверка существования графика
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

  // Получение сотрудников для автозаполнения
  const {
    data: responsibleData,
    isLoading: isLoadingResponsible,
    refetch: refetchResponsible,
  } = useGetResponsibleOnWeekendsQuery(undefined, {
    skip: formData.scheduleType !== 'responsibleOnWeekends',
  });

  const {
    data: safetyData,
    isLoading: isLoadingSafety,
    refetch: refetchSafety,
  } = useGetSafetyOfficersQuery(undefined, {
    skip: formData.scheduleType !== 'safetyOfficers',
  });

  // Мутации для создания
  const [createSchedule, { isLoading: isCreating, error: createError }] =
    useCreateScheduleMutation();
  const [
    createFromTemplate,
    { isLoading: isCreatingFromTemplate, error: templateError },
  ] = useCreateScheduleFromTemplateMutation();

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Автозаполнение при изменении типа графика или загрузке данных
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

  // Обработчик автозаполнения
  const handleAutoFill = () => {
    if (formData.scheduleType === 'responsibleOnWeekends') {
      refetchResponsible();
    } else {
      refetchSafety();
    }
  };

  // Обработчик создания из шаблона
  const handleCreateFromTemplate = async () => {
    if (!formData.month || !formData.scheduleType) {
      setSnackbar({
        open: true,
        message: 'Сначала выберите месяц и тип графика',
        severity: 'error',
      });
      return;
    }

    try {
      await createFromTemplate({
        month: formData.month,
        scheduleType: formData.scheduleType,
      }).unwrap();

      refetchExisting(); // Обновляем проверку существования

      setSnackbar({
        open: true,
        message: 'График создан из шаблона',
        severity: 'success',
      });
    } catch (error) {
      console.error('Ошибка при создании из шаблона:', error);
    }
  };

  // Обработчик сохранения
  const handleSave = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Исправьте ошибки в форме',
        severity: 'error',
      });
      return;
    }

    // Проверка существования графика
    if (existingSchedule?.data) {
      setSnackbar({
        open: true,
        message: `График на ${formData.month} уже существует`,
        severity: 'error',
      });
      return;
    }

    try {
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

      await createSchedule(scheduleData).unwrap();

      setSnackbar({
        open: true,
        message: 'График успешно создан',
        severity: 'success',
      });

      resetForm();
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
    }
  };

  const isLoading =
    isLoadingExisting ||
    isLoadingResponsible ||
    isLoadingSafety ||
    isCreating ||
    isCreatingFromTemplate;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Создание графика
      </Typography>

      <Grid container spacing={3}>
        {/* Левая колонка: Настройки */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <MonthSelector
              month={formData.month}
              monthOptions={monthOptions}
              onChange={updateMonth}
              error={validationErrors.month}
              disabled={isLoading}
            />

            <ScheduleTypeSelector
              scheduleType={formData.scheduleType}
              onChange={updateScheduleType}
              error={validationErrors.scheduleType}
              disabled={isLoading}
            />

            {existingSchedule?.data && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                График на {formData.month} уже существует
              </Alert>
            )}

            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}
            >
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleAutoFill}
                disabled={isLoading || !formData.month}
                fullWidth
              >
                Автозаполнить из сотрудников
              </Button>

              <Button
                variant="contained"
                onClick={handleCreateFromTemplate}
                disabled={
                  isLoading || !formData.month || !!existingSchedule?.data
                }
                fullWidth
              >
                Создать из шаблона
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка: Таблица */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <LoadingErrorWrapper
              isLoading={isLoading}
              error={createError || templateError}
              onRetry={() => {
                refetchExisting();
                refetchResponsible();
                refetchSafety();
              }}
            >
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

              {formData.entries.length === 0 ? (
                <Alert severity="info">
                  Добавьте сотрудников или создайте график из шаблона
                </Alert>
              ) : (
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
                          onUpdate={(updates) => updateEntry(entry.id, updates)}
                          onRemove={() => removeEntry(entry.id)}
                          onAddDate={(date) => addDateToEntry(entry.id, date)}
                          onRemoveDate={(date) =>
                            removeDateFromEntry(entry.id, date)
                          }
                          errors={validationErrors.entries?.[entry.id]}
                          disabled={isLoading}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

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
            </LoadingErrorWrapper>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
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
