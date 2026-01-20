import React, { useMemo, useState } from 'react';
import { Box, Collapse } from '@mui/material';

import { useCreateWorkPlanMutation } from '@store/slices';
import { validateWorkPlan, ValidationError } from '@utils/validationPlan';
import { MONTHS } from '@utils/dateUtils';
import { LocalDayPlan } from 'src/types/workPlan.types';

import { getWorkingDays } from '@utils/dateUtils';
import { useWorkPlanCreation } from '@hooks/useWorkPlanCreation';
import {
  MonthSelectionStep,
  SaturdaySelectionStep,
  PlaceholderStep,
  AnnouncementsStep,
  TemplateActionsStep,
  SpecialDaysStep,
} from './creationSteps';
import PlanActions from './planActions';

import ValidationErrors from './validationErrors';

import {
  DayPlan,
  LocalAnnouncement,
  Announcement,
} from 'src/types/workPlan.types';
import PlanTable from './table/planTable';

const WorkPlanPanel: React.FC = () => {
  const {
    // Состояния
    selectedMonth,
    selectedMonthNumber,
    selectedYear,
    workingSaturdays,
    specialDays,
    announcements,
    days,
    isSubmitted,
    isLoadingPlans,

    // Вычисляемые значения
    availableMonths,
    saturdaysOfMonth,
    allDaysInMonth,

    // Обработчики
    handleMonthSelect,
    handleSaturdayToggle,
    handleSpecialDayAdd,
    handleSpecialDayRemove,
    handleAnnouncementAdd,
    handleAnnouncementRemove,
    handleResetAll,
    setTemplateDays,
    setDays,
  } = useWorkPlanCreation();

  // Локальные состояния для валидации
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showErrors, setShowErrors] = useState(false);

  // API для создания плана
  const [
    createWorkPlan,
    { isLoading: isCreating, error: apiError, isSuccess },
  ] = useCreateWorkPlanMutation();

  // Проверяем, есть ли дни без мероприятий
  const hasEmptyDays = useMemo(() => {
    return days.some((day) => !day.isSpecialDay && day.events.length === 0);
  }, [days]);

  // Проверяем, все ли обязательные поля заполнены
  const isPlanComplete = useMemo(() => {
    if (days.length === 0) return false;
    if (hasEmptyDays) return false;

    const errors = validateWorkPlan(days);
    return errors.length === 0;
  }, [days, hasEmptyDays]);

  // Конвертеры для отправки на сервер
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

  const convertToServerAnnouncement = (
    localAnnouncement: LocalAnnouncement
  ): Announcement => ({
    id: localAnnouncement.id,
    dayNumber: localAnnouncement.dayNumber,
    title: localAnnouncement.title,
    style: localAnnouncement.style,
    order: localAnnouncement.order,
  });

  // Обработчик создания шаблона (логика из handleCreateTemplate)
  const handleCreateTemplate = () => {
    if (!selectedMonthNumber || !selectedYear) return;

    // Используем существующую логику создания шаблона
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
        // Специальный день
        return {
          id: specialDay.id,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          isSpecialDay: true,
          specialDayTitle: specialDay.title,
          events: [
            {
              id: `event-special-${Math.random().toString(36).substring(2, 9)}`,
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

    setTemplateDays(daysToShow as LocalDayPlan[]);
    setValidationErrors([]);
    setShowErrors(false);
  };

  // Обработчики для таблицы (перенесены из оригинала)
  const handleAddEvent = (dayId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const newEvent = {
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
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, time } : event
          );

          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: updatedEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return {
            ...day,
            events: updatedEvents,
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
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, description } : event
          );

          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: updatedEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return {
            ...day,
            events: updatedEvents,
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
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, responsiblePersons } : event
          );

          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: updatedEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return {
            ...day,
            events: updatedEvents,
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

          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: newEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return { ...day, events: newEvents };
        }
        return day;
      })
    );
  };

  const handleSubmit = async () => {
    if (!selectedMonthNumber || !selectedYear || days.length === 0) return;

    // Проверяем валидацию
    const errors = validateWorkPlan(days);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrors(true);
      return;
    }

    const planData = {
      month: MONTHS[selectedMonthNumber - 1],
      monthNumber: selectedMonthNumber,
      year: selectedYear,
      days: days.map(convertToServerDayPlan),
      announcements: announcements.map(convertToServerAnnouncement),
      workingSaturdays: workingSaturdays,
    };

    try {
      await createWorkPlan(planData).unwrap();
      setValidationErrors([]);
      setShowErrors(false);
      // очистить анонсы через хук, если нужно
      handleResetAll();
    } catch (err) {
      console.error('Ошибка при создании плана:', err);
    }
  };

  const handleCancel = () => {
    setDays([]);
    setValidationErrors([]);
    setShowErrors(false);
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: '0 auto', p: 3 }}>
      {/* Первая строка: Шаги 1 и 2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
          alignItems: 'stretch',
        }}
      >
        {/* Шаг 1: Выбор месяца */}
        <MonthSelectionStep
          selectedMonth={selectedMonth}
          availableMonths={availableMonths}
          isLoading={isLoadingPlans}
          onMonthSelect={handleMonthSelect}
        />

        {/* Шаг 2: Рабочие субботы */}
        {selectedMonth && saturdaysOfMonth.length > 0 ? (
          <SaturdaySelectionStep
            saturdays={saturdaysOfMonth}
            workingSaturdays={workingSaturdays}
            selectedMonthNumber={selectedMonthNumber}
            isLoading={isLoadingPlans}
            onSaturdayToggle={handleSaturdayToggle}
          />
        ) : (
          <PlaceholderStep message="Сначала выберите месяц для отображения суббот" />
        )}
      </Box>

      {/* Вторая строка: Шаги 3, 4 и 5 - только если выбран месяц */}
      {selectedMonth && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {/* Шаг 3: Специальные дни */}
          <SpecialDaysStep
            allDays={allDaysInMonth}
            specialDays={specialDays}
            selectedMonthNumber={selectedMonthNumber}
            isLoading={isLoadingPlans}
            onAddSpecialDay={handleSpecialDayAdd}
            onRemoveSpecialDay={handleSpecialDayRemove}
          />

          {/* Шаг 4: Анонсы мероприятий */}
          <AnnouncementsStep
            allDays={allDaysInMonth}
            announcements={announcements}
            isLoading={isLoadingPlans}
            onAddAnnouncement={handleAnnouncementAdd}
            onRemoveAnnouncement={handleAnnouncementRemove}
          />

          {/* Шаг 5: Создать план мероприятий */}
          <TemplateActionsStep
            workingSaturdaysCount={workingSaturdays.length}
            specialDaysCount={specialDays.length}
            announcementsCount={announcements.length}
            isLoading={isLoadingPlans}
            onCreateTemplate={handleCreateTemplate}
            onResetAll={handleResetAll}
          />
        </Box>
      )}

      {/* Отображение ошибок валидации */}
      <Collapse in={showErrors && validationErrors.length > 0}>
        <Box sx={{ mb: 3 }}>
          <ValidationErrors
            errors={validationErrors}
            onClose={() => setShowErrors(false)}
          />
        </Box>
      </Collapse>

      {isSubmitted && days.length > 0 && (
        <>
          <PlanTable
            days={days}
            announcements={announcements}
            monthNumber={selectedMonthNumber}
            year={selectedYear}
            error={apiError}
            isSuccess={isSuccess}
            onAddEvent={handleAddEvent}
            onUpdateEventTime={handleUpdateEventTime}
            onUpdateEventDescription={handleUpdateEventDescription}
            onUpdateEventResponsible={handleUpdateEventResponsible}
            onRemoveEvent={handleRemoveEvent}
            validationErrors={validationErrors}
            hasEmptyDays={hasEmptyDays}
          />

          <PlanActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            isDisabled={days.length === 0 || hasEmptyDays || !isPlanComplete}
            hasValidationErrors={validationErrors.length > 0}
          />
        </>
      )}
    </Box>
  );
};

export default WorkPlanPanel;
