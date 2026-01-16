import React, { useState, useMemo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import {
  useCreateWorkPlanMutation,
  useGetAllWorkPlansQuery,
} from '@store/slices';
import {
  getAvailableMonths,
  getSaturdaysOfMonth,
  MONTHS,
  getWorkingDays,
} from '@utils/dateUtils';

import { DayPlan, LocalDayPlan, LocalEvent } from 'src/types/workPlan.types';
import MonthSelector from './monthSelector';
import PlanActions from './planActions';
import PlanTable from './planTable';
import SaturdaySelector from './saturdaySelector';

const WorkPlanPanel: React.FC = () => {
  // Состояния
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number>(0);
  const [workingSaturdays, setWorkingSaturdays] = useState<number[]>([]);
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

  // Обработчики
  const handleMonthSelect = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setSelectedMonth(value);
    setSelectedYear(year);
    setSelectedMonthNumber(month);
    setWorkingSaturdays([]);
    setDays([]);
  };

  const handleSaturdayToggle = (dayNumber: number) => {
    setWorkingSaturdays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const handleCreateTemplate = () => {
    if (!selectedMonthNumber || !selectedYear) return;

    const workingDays = getWorkingDays(
      selectedYear,
      selectedMonthNumber,
      workingSaturdays
    );
    const newDays: LocalDayPlan[] = workingDays.map((day) => ({
      id: `day-${Math.random().toString(36).substring(2, 9)}`,
      dayNumber: day.dayNumber,
      dayOfWeek: day.dayOfWeek,
      events: [],
    }));

    setDays(newDays);
  };

  // Обработчики событий (можно вынести в хук)
  const handleAddEvent = (dayId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
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

  const handleUpdateEventResponsible = (dayId: string, eventId: string, responsiblePersons: string[]) => {
    setDays(prev => prev.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          events: day.events.map(event => 
            event.id === eventId ? { ...event, responsiblePersons } : event
          ),
        };
      }
      return day;
    }));
  };

  const handleRemoveEvent = (dayId: string, eventId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            events: day.events.filter((event) => event.id !== eventId),
          };
        }
        return day;
      })
    );
  };

  const handleCancel = () => {
    setDays([]);
    setSelectedMonth('');
    setWorkingSaturdays([]);
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
      <MonthSelector
        selectedMonth={selectedMonth}
        availableMonths={availableMonths}
        onMonthSelect={handleMonthSelect}
        isLoading={isLoadingPlans}
      />

      {selectedMonth && saturdaysOfMonth.length > 0 && (
        <SaturdaySelector
          saturdays={saturdaysOfMonth}
          workingSaturdays={workingSaturdays}
          selectedMonthNumber={selectedMonthNumber}
          onSaturdayToggle={handleSaturdayToggle}
          onCreateTemplate={handleCreateTemplate}
          disabled={isLoadingPlans}
        />
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
