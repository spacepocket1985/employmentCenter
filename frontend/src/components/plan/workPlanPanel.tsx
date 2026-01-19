import React, { useState, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import {
  useCreateWorkPlanMutation,
  useGetAllWorkPlansQuery,
} from '@store/slices';
import {
  getAvailableMonths,
  getSaturdaysOfMonth,
  MONTHS,
  getWorkingDays,
  getDaysInMonth,
  DAYS_OF_WEEK,
} from '@utils/dateUtils';

import { DayPlan, LocalDayPlan, LocalEvent } from 'src/types/workPlan.types';
import MonthSelector from './monthSelector';
import PlanActions from './planActions';
import PlanTable from './planTable';
import SaturdaySelector from './saturdaySelector';
import SpecialDaysSelector from './specialDaysSelector';
import { planStylesForCreate } from 'src/const';

interface SpecialDay {
  id: string;
  dayNumber: number;
  title: string;
  dayOfWeek: string;
}

const WorkPlanPanel: React.FC = () => {
  // Состояния
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number>(0);
  const [workingSaturdays, setWorkingSaturdays] = useState<number[]>([]);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [days, setDays] = useState<LocalDayPlan[]>([]);

  // API
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetAllWorkPlansQuery();
  const [createWorkPlan, { isLoading: isCreating, error, isSuccess }] =
    useCreateWorkPlanMutation();

  // Мемоизированные значения
  const availableMonths = useMemo(() => {
    const existingPlans = plansData?.data || [];
    return getAvailableMonths(existingPlans);
  }, [plansData]);

  const saturdaysOfMonth = useMemo(() => {
    if (!selectedMonthNumber || !selectedYear) return [];
    return getSaturdaysOfMonth(selectedYear, selectedMonthNumber);
  }, [selectedYear, selectedMonthNumber]);

  const allDaysInMonth = useMemo(() => {
    if (!selectedMonthNumber || !selectedYear) return [];
    const daysCount = getDaysInMonth(selectedYear, selectedMonthNumber);
    const days: Array<{ dayNumber: number; dayOfWeek: string }> = [];

    for (let i = 1; i <= daysCount.length; i++) {
      const date = new Date(selectedYear, selectedMonthNumber - 1, i);
      const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
      days.push({ dayNumber: i, dayOfWeek });
    }

    return days;
  }, [selectedYear, selectedMonthNumber]);

  // Обработчики
  const handleMonthSelect = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setSelectedMonth(value);
    setSelectedYear(year);
    setSelectedMonthNumber(month);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setDays([]);
  };

  const handleSaturdayToggle = (dayNumber: number) => {
    setWorkingSaturdays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const handleSpecialDayAdd = (dayNumber: number, title: string) => {
    const dayInfo = allDaysInMonth.find((d) => d.dayNumber === dayNumber);
    if (!dayInfo) return;

    const newSpecialDay: SpecialDay = {
      id: `special-${Math.random().toString(36).substring(2, 9)}`,
      dayNumber,
      title,
      dayOfWeek: dayInfo.dayOfWeek,
    };

    setSpecialDays((prev) => [...prev, newSpecialDay]);
  };

  const handleSpecialDayRemove = (id: string) => {
    setSpecialDays((prev) => prev.filter((day) => day.id !== id));
  };

  const handleCreateTemplate = () => {
    if (!selectedMonthNumber || !selectedYear) return;

    const workingDays = getWorkingDays(
      selectedYear,
      selectedMonthNumber,
      workingSaturdays
    );

    // Создаем массив всех дней месяца
    const allDays = allDaysInMonth.map((day) => {
      // Проверяем, является ли этот день рабочим
      const isWorkingDay = workingDays.some(
        (wd) => wd.dayNumber === day.dayNumber
      );

      // Проверяем, является ли этот день специальным
      const specialDay = specialDays.find(
        (sd) => sd.dayNumber === day.dayNumber
      );

      if (specialDay) {
        // Специальный день - создаем его с мероприятием
        return {
          id: specialDay.id,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          isSpecialDay: true,
          specialDayTitle: specialDay.title,
          events: [
            {
              id: `event-${Math.random().toString(36).substring(2, 9)}`,
              time: '',
              description: specialDay.title,
              responsiblePersons: [],
            },
          ],
        };
      } else if (isWorkingDay) {
        // Рабочий день без специального мероприятия
        return {
          id: `day-${Math.random().toString(36).substring(2, 9)}`,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          events: [],
        };
      } else {
        // Нерабочий день (без мероприятий)
        return {
          id: `day-${Math.random().toString(36).substring(2, 9)}`,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          events: [],
        };
      }
    });

    // Фильтруем только дни, которые нужно показать (рабочие или специальные)
    const daysToShow = allDays.filter((day) => {
      const isWorking = workingDays.some(
        (wd) => wd.dayNumber === day.dayNumber
      );
      const isSpecial = specialDays.some(
        (sd) => sd.dayNumber === day.dayNumber
      );
      return isWorking || isSpecial;
    });

    // Сортируем по номеру дня
    daysToShow.sort((a, b) => a.dayNumber - b.dayNumber);

    setDays(daysToShow as LocalDayPlan[]);
  };

  const handleResetAll = () => {
    setSelectedMonth('');
    setSelectedYear(new Date().getFullYear());
    setSelectedMonthNumber(0);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setDays([]);
  };

  // Обработчики событий
  const handleAddEvent = (dayId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId && !day.isSpecialDay) {
          const newEvent: LocalEvent = {
            id: `event-${Math.random().toString(36).substring(2, 9)}`,
            time: '',
            description: '',
            responsiblePersons: [],
          };
          return { ...day, events: [...day.events, newEvent] };
        }
        return day;
      })
    );
  };

  const handleUpdateEventTime = (
    dayId: string,
    eventId: string,
    time: string
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            events: day.events.map((event) =>
              event.id === eventId ? { ...event, time } : event
            ),
          };
        }
        return day;
      })
    );
  };

  const handleUpdateEventDescription = (
    dayId: string,
    eventId: string,
    description: string
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            events: day.events.map((event) =>
              event.id === eventId ? { ...event, description } : event
            ),
          };
        }
        return day;
      })
    );
  };

  const handleUpdateEventResponsible = (
    dayId: string,
    eventId: string,
    responsiblePersons: string[]
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            events: day.events.map((event) =>
              event.id === eventId ? { ...event, responsiblePersons } : event
            ),
          };
        }
        return day;
      })
    );
  };

  const handleRemoveEvent = (dayId: string, eventId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId && !day.isSpecialDay) {
          const newEvents = day.events.filter((event) => event.id !== eventId);
          return { ...day, events: newEvents };
        }
        return day;
      })
    );
  };

  const handleCancel = () => {
    setDays([]);
    setWorkingSaturdays([]);
    setSpecialDays([]);
  };

  const convertToServerDayPlan = (localDay: LocalDayPlan): DayPlan => ({
    id: localDay.id,
    dayNumber: localDay.dayNumber,
    dayOfWeek: localDay.dayOfWeek,
    isSpecialDay: localDay.isSpecialDay,
    specialDayTitle: localDay.specialDayTitle,
    events: localDay.events.map((event) => ({
      id: event.id,
      time: event.time,
      description: event.description,
      responsiblePersons: event.responsiblePersons,
      notes: event.notes,
    })),
  });

  const handleSubmit = async () => {
    if (!selectedMonthNumber || !selectedYear || days.length === 0) return;

    const planData = {
      month: MONTHS[selectedMonthNumber - 1],
      monthNumber: selectedMonthNumber,
      year: selectedYear,
      days: days.map(convertToServerDayPlan),
    };

    try {
      await createWorkPlan(planData).unwrap();
    } catch (err) {
      console.error('Ошибка при создании плана:', err);
    }
  };

  if (isLoadingPlans) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1600, margin: '0 auto', p: 3 }}>
      {/* Первая строка: Выбор месяца и рабочие субботы */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography
              variant="h6"
              gutterBottom
              fontWeight={600}
              sx={planStylesForCreate}
            >
              1. Выберите месяц
            </Typography>
            <Box sx={{ mt: 2 }}>
              <MonthSelector
                selectedMonth={selectedMonth}
                availableMonths={availableMonths}
                onMonthSelect={handleMonthSelect}
                isLoading={isLoadingPlans}
              />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedMonth && saturdaysOfMonth.length > 0 ? (
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={planStylesForCreate}>
                2. Укажите рабочие субботы
              </Typography>
              <Box sx={{ mt: 2 }}>
                <SaturdaySelector
                  saturdays={saturdaysOfMonth}
                  workingSaturdays={workingSaturdays}
                  selectedMonthNumber={selectedMonthNumber}
                  onSaturdayToggle={handleSaturdayToggle}
                  onCreateTemplate={() => {}}
                  disabled={isLoadingPlans}
                />
              </Box>
            </Paper>
          ) : (
            <Paper
              sx={{
                p: 3,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                color="text.secondary"
                textAlign="center"
              >
                Сначала выберите месяц для отображения суббот
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Вторая строка: Специальные дни и создание шаблона */}
      {selectedMonth && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
                sx={planStylesForCreate}
              >
                3. Укажите специальные дни
              </Typography>
              <Box sx={{ mt: 2 }}>
                <SpecialDaysSelector
                  allDays={allDaysInMonth}
                  specialDays={specialDays}
                  selectedMonthNumber={selectedMonthNumber}
                  onAddSpecialDay={handleSpecialDayAdd}
                  onRemoveSpecialDay={handleSpecialDayRemove}
                  disabled={isLoadingPlans}
                />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom fontWeight={600} sx={planStylesForCreate}>
                4. Создать план мероприятий
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    После выбора рабочих суббот и специальных дней нажмите
                    кнопку для создания шаблона плана.
                  </Typography>

                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        Выбрано:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Рабочих суббот: {workingSaturdays.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Специальных дней: {specialDays.length}
                      </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleCreateTemplate}
                        disabled={
                          isLoadingPlans ||
                          (workingSaturdays.length === 0 &&
                            specialDays.length === 0)
                        }
                        fullWidth
                      >
                        Создать шаблон плана
                      </Button>

                      <Button
                        variant="outlined"
                        onClick={handleResetAll}
                        color="error"
                        disabled={isLoadingPlans}
                        fullWidth
                      >
                        Сбросить все
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {days.length > 0 && (
        <>
          <PlanTable
            days={days}
            monthNumber={selectedMonthNumber}
            year={selectedYear}
            error={error}
            isSuccess={isSuccess}
            onAddEvent={handleAddEvent}
            onUpdateEventTime={handleUpdateEventTime}
            onUpdateEventDescription={handleUpdateEventDescription}
            onUpdateEventResponsible={handleUpdateEventResponsible}
            onRemoveEvent={handleRemoveEvent}
          />

          <PlanActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            isDisabled={days.length === 0}
          />
        </>
      )}
    </Box>
  );
};

export default WorkPlanPanel;
