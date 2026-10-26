import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';

import { EmployeeCard } from './EmployeeCard';
import { fetchBirthdays } from '../../api/employeesApi';
import { EmployeeBirthdayType, BirthdaysApiResponse } from '../../types/employee.types';

const Months: { value: string; label: string }[] = [
  { value: '', label: 'Все месяцы' },
  { value: '1', label: 'Январь' },
  { value: '2', label: 'Февраль' },
  { value: '3', label: 'Март' },
  { value: '4', label: 'Апрель' },
  { value: '5', label: 'Май' },
  { value: '6', label: 'Июнь' },
  { value: '7', label: 'Июль' },
  { value: '8', label: 'Август' },
  { value: '9', label: 'Сентябрь' },
  { value: '10', label: 'Октябрь' },
  { value: '11', label: 'Ноябрь' },
  { value: '12', label: 'Декабрь' },
];

const SEARCH_DEBOUNCE_MS = 300;

export const BirthdaysDialog: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  // Фильтры
  const [month, setMonth] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  // Данные
  const [employees, setEmployees] = useState<EmployeeBirthdayType[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Флаг «был хотя бы один ответ» — чтобы не показывать
  // «Ничего не найдено» до первой загрузки.
  const [initialized, setInitialized] = useState<boolean>(false);

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  // Загрузка данных при изменении фильтров или открытии
  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response: BirthdaysApiResponse = await fetchBirthdays({
          month: month || undefined,
          department: department || undefined,
          search: debouncedSearch || undefined,
        });

        if (cancelled) return;

        setEmployees(response.data);
        if (response.departments.length > 0) {
          setDepartments(response.departments);
        }
        setInitialized(true);
      } catch (err: unknown) {
        if (cancelled) return;
        const message: string =
          err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(message);
        setInitialized(true);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open, month, department, debouncedSearch]);

  // Опции отделов
  const departmentOptions = useMemo(
    () => [
      { value: '', label: 'Все отделы' },
      ...departments.map((d) => ({ value: d, label: d })),
    ],
    [departments]
  );

  const showSpinner: boolean = !initialized || loading;
  const showEmpty: boolean =
    initialized && !loading && !error && employees.length === 0;
  const showList: boolean =
    initialized && !loading && !error && employees.length > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={false}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#103896',
          color: 'white',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          padding: '0.75rem 1rem',
        }}
      >
        <CakeIcon />
        <Typography component="span" variant="body2" fontWeight={600}>
          Все дни рождения сотрудников
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ mb: 2 }}
        >
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="birthdays-month-label">Месяц</InputLabel>
            <Select
              labelId="birthdays-month-label"
              label="Месяц"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              {Months.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="birthdays-department-label">Отдел</InputLabel>
            <Select
              labelId="birthdays-department-label"
              label="Отдел"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departmentOptions.map((d) => (
                <MenuItem key={d.value} value={d.value}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="Поиск по ФИО"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, minWidth: 200 }}
          />
        </Stack>

        {showSpinner && (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={32} />
          </Box>
        )}

        {!loading && error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {showEmpty && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            py={4}
          >
            Ничего не найдено
          </Typography>
        )}

        {showList && (
          <Box>
            {employees.map((employee, index) => (
              <Card
                key={employee._id}
                variant="outlined"
                sx={{
                  mb: 1.2,
                  borderRadius: 2,
                  bgcolor:
                    index % 2 !== 0 ? 'background.default' : 'action.hover',
                }}
              >
                {/* [ИЗМЕНЕНО] EmployeeBirthdayCard → EmployeeCard с флагами из employee */}
                <EmployeeCard
                  employee={employee}
                  isToday={employee.isToday}
                  isSoon={employee.isSoon}
                />
              </Card>
            ))}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Закрыть</Button>
      </DialogActions>
    </Dialog>
  );
};
