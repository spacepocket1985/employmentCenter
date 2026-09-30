// Описание: Компонент выбора сотрудника для именных тестов
// Поддерживает три режима: выбор из списка, ручной ввод, анонимно

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormHelperText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Edit as EditIcon,
  VisibilityOff as AnonymousIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';
import { useMasters } from '@hooks/useMasters';
import { useAppDispatch, useAppSelector } from '@hooks/storeHooks';
import {
  setSelectedEmployee,
  setEmployeeSelectionMode,
  setManualEmployeeName,
  selectEmployeeSelectionMode,
  selectSelectedEmployee,
  selectManualEmployeeName,
  selectIsEmployeeSelectionComplete,
  confirmEmployeeSelection,
} from '@store/slices/testSlice';
import type { EmployeeSelectionMode } from '@store/slices/testSlice';
import type { EmployeeType } from 'src/types/employee.types';

/**
 * Props для EmployeeSelector
 */
type EmployeeSelectorProps = {
  /** Обработчик начала теста */
  onStart: () => void;
};

/**
 * Компонент выбора сотрудника
 */
export const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  onStart,
}: EmployeeSelectorProps): React.ReactElement => {
  const dispatch = useAppDispatch();

  // Загружаем мастеров
  const { masters, loading, error } = useMasters();

  // Получаем состояние из Redux
  const selectionMode: EmployeeSelectionMode = useAppSelector(
    selectEmployeeSelectionMode
  );
  const selectedEmployee = useAppSelector(selectSelectedEmployee);
  const manualEmployeeName = useAppSelector(selectManualEmployeeName);
  const isComplete = useAppSelector(selectIsEmployeeSelectionComplete);

  // Локальное состояние для ошибок валидации
  const [validationError, setValidationError] = useState<string | null>(null);

  // ============================================
  // ОБРАБОТЧИКИ
  // ============================================

  /**
   * Смена режима выбора
   */
  const handleModeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const mode = event.target.value as EmployeeSelectionMode;
    dispatch(setEmployeeSelectionMode(mode));
    setValidationError(null);
  };

  /**
   * Выбор сотрудника из списка
   */
  const handleEmployeeSelect = (event: SelectChangeEvent<string>): void => {
    const employeeId = event.target.value as string;
    const employee = masters.find((m) => m._id === employeeId);

    if (employee) {
      dispatch(setSelectedEmployee(employee));
      setValidationError(null);
    }
  };

  /**
   * Ввод ФИО вручную
   */
  const handleManualNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(setManualEmployeeName(event.target.value));
    setValidationError(null);
  };

  /**
   * Начало теста
   */
  const handleStart = (): void => {
    if (!isComplete) {
      if (selectionMode === 'list') {
        setValidationError('Выберите сотрудника из списка');
      } else if (selectionMode === 'manual') {
        setValidationError('Введите ФИО');
      }
      return;
    }

    dispatch(confirmEmployeeSelection());
    onStart();
  };

  // ============================================
  // РЕНДЕР
  // ============================================

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      {/* Заголовок */}
      <Typography variant="h5" gutterBottom sx={{ color: '#103896', mb: 3 }}>
        Выберите сотрудника
      </Typography>

      {/* Radio buttons для выбора режима */}
      <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
        <RadioGroup value={selectionMode} onChange={handleModeChange}>
          <FormControlLabel
            value="list"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ color: '#103896' }} />
                <Typography>Выбрать из списка мастеров</Typography>
              </Box>
            }
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: selectionMode === 'list' ? '#103896' : 'divider',
              backgroundColor:
                selectionMode === 'list'
                  ? 'rgba(16, 56, 150, 0.04)'
                  : 'transparent',
            }}
          />
          <FormControlLabel
            value="manual"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EditIcon sx={{ color: '#103896' }} />
                <Typography>Ввести ФИО вручную</Typography>
              </Box>
            }
            sx={{
              mb: 1,
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: selectionMode === 'manual' ? '#103896' : 'divider',
              backgroundColor:
                selectionMode === 'manual'
                  ? 'rgba(16, 56, 150, 0.04)'
                  : 'transparent',
            }}
          />
          <FormControlLabel
            value="anonymous"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnonymousIcon sx={{ color: '#103896' }} />
                <Typography>Пройти анонимно (тренировка)</Typography>
              </Box>
            }
            sx={{
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor:
                selectionMode === 'anonymous' ? '#103896' : 'divider',
              backgroundColor:
                selectionMode === 'anonymous'
                  ? 'rgba(16, 56, 150, 0.04)'
                  : 'transparent',
            }}
          />
        </RadioGroup>
      </FormControl>

      {/* ============================================ */}
      {/* РЕЖИМ: ВЫБОР ИЗ СПИСКА */}
      {/* ============================================ */}
      {selectionMode === 'list' && (
        <Box sx={{ mb: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              Ошибка загрузки списка мастеров: {error.message}
            </Alert>
          ) : masters.length === 0 ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Нет доступных мастеров</AlertTitle>
              Вы можете ввести ФИО вручную или пройти тест анонимно.
            </Alert>
          ) : (
            <FormControl
              fullWidth
              error={!!validationError && selectionMode === 'list'}
            >
              <InputLabel id="employee-select-label">Сотрудник</InputLabel>
              <Select
                labelId="employee-select-label"
                value={selectedEmployee?._id || ''}
                onChange={handleEmployeeSelect}
                label="Сотрудник"
              >
                {masters.map((master: EmployeeType) => (
                  <MenuItem key={master._id} value={master._id}>
                    {master.name} — {master.job} ({master.department})
                  </MenuItem>
                ))}
              </Select>
              {validationError && selectionMode === 'list' && (
                <FormHelperText>{validationError}</FormHelperText>
              )}
            </FormControl>
          )}
        </Box>
      )}

      {/* ============================================ */}
      {/* РЕЖИМ: РУЧНОЙ ВВОД */}
      {/* ============================================ */}
      {selectionMode === 'manual' && (
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="ФИО"
            value={manualEmployeeName}
            onChange={handleManualNameChange}
            placeholder="Иванов Иван Иванович"
            error={!!validationError && selectionMode === 'manual'}
            helperText={
              validationError && selectionMode === 'manual'
                ? validationError
                : 'Введите ФИО полностью'
            }
          />
        </Box>
      )}

      {/* ============================================ */}
      {/* РЕЖИМ: АНОНИМНО */}
      {/* ============================================ */}
      {selectionMode === 'anonymous' && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="warning">
            <AlertTitle>Результат не будет сохранён</AlertTitle>
            Вы проходите тест в режиме тренировки. Результат будет показан, но
            не сохранится в базе данных.
          </Alert>
        </Box>
      )}

      {/* ============================================ */}
      {/* КНОПКА НАЧАЛА ТЕСТА */}
      {/* ============================================ */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={handleStart}
          disabled={!isComplete || loading}
          startIcon={<PlayArrowIcon />}
          sx={{
            backgroundColor: '#103896',
            '&:hover': {
              backgroundColor: '#0d2d7a',
            },
            px: 4,
            py: 1.5,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          Начать тест
        </Button>
      </Box>
    </Paper>
  );
};
