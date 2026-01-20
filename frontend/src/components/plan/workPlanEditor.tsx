// components/WorkPlanEditor.tsx
import React, { useMemo, useState, useEffect } from 'react';
import { Box, Collapse, Typography } from '@mui/material';

import { useUpdateWorkPlanMutation } from '@store/slices';
import { validateWorkPlan, ValidationError } from '@utils/validationPlan';
import {
  MONTHS,
  getDaysInMonth,
  DAYS_OF_WEEK,
  getSaturdaysOfMonth,
  getWorkingDays,
} from '@utils/dateUtils';
import {
  DayPlan,
  LocalDayPlan,
  LocalAnnouncement,
  Announcement,
  LocalEvent,
  SpecialDay,
} from 'src/types/workPlan.types';
import {
  SaturdaySelectionStep,
  SpecialDaysStep,
  AnnouncementsStep,
} from './creationSteps';
import PlanActions from './planActions';
import PlanTable from './table/planTable';
import ValidationErrors from './validationErrors';

interface WorkPlanEditorProps {
  planId: string;
  initialData: {
    monthNumber: number;
    year: number;
    days: DayPlan[];
    announcements: Announcement[];
    workingSaturdays?: number[];
  };
  onCancel?: () => void;
  onSuccess?: () => void;
}

export const WorkPlanEditor: React.FC<WorkPlanEditorProps> = ({
  planId,
  initialData,
  onCancel,
  onSuccess,
}) => {
  // Состояния
  const [days, setDays] = useState<LocalDayPlan[]>([]);
  const [announcements, setAnnouncements] = useState<LocalAnnouncement[]>([]);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [workingSaturdays, setWorkingSaturdays] = useState<number[]>(
    initialData.workingSaturdays || []
  );
  const [pendingWorkingSaturdays, setPendingWorkingSaturdays] = useState<
    number[]
  >(initialData.workingSaturdays || []);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showErrors, setShowErrors] = useState(false);

  // API для обновления плана
  const [
    updateWorkPlan,
    { isLoading: isUpdating, error: apiError, isSuccess },
  ] = useUpdateWorkPlanMutation();

  // Инициализация данных при монтировании
  useEffect(() => {
    // Конвертируем дни из серверного формата в локальный
    const convertedDays: LocalDayPlan[] = initialData.days.map((day) => ({
      id: day.id,
      dayNumber: day.dayNumber,
      dayOfWeek: day.dayOfWeek,
      isSpecialDay: day.isSpecialDay || false,
      specialDayTitle: day.specialDayTitle || '',
      events: day.events.map((event) => ({
        id: event.id,
        time: event.time,
        description: event.description,
        responsiblePersons: event.responsiblePersons || [],
        notes: event.notes || '',
      })),
    }));

    setDays(convertedDays);

    // Конвертируем анонсы
    const convertedAnnouncements: LocalAnnouncement[] =
      initialData.announcements.map((announcement, index) => ({
        id: announcement.id,
        dayNumber: announcement.dayNumber,
        title: announcement.title,
        style: announcement.style,
        order: announcement.order || index,
      }));

    setAnnouncements(convertedAnnouncements);

    // Извлекаем специальные дни из days
    const extractedSpecialDays: SpecialDay[] = initialData.days
      .filter((day) => day.isSpecialDay && day.specialDayTitle)
      .map((day) => ({
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.specialDayTitle!,
        dayOfWeek: day.dayOfWeek,
      }));

    setSpecialDays(extractedSpecialDays);

    // Устанавливаем рабочие субботы
    setWorkingSaturdays(initialData.workingSaturdays || []);
    setPendingWorkingSaturdays(initialData.workingSaturdays || []);
  }, [initialData]);

  // Вычисляем все дни месяца
  const allDaysInMonth = useMemo(() => {
    const daysCount = getDaysInMonth(initialData.year, initialData.monthNumber);
    const days: Array<{ dayNumber: number; dayOfWeek: string }> = [];

    for (let i = 1; i <= daysCount.length; i++) {
      const date = new Date(initialData.year, initialData.monthNumber - 1, i);
      const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
      days.push({ dayNumber: i, dayOfWeek });
    }

    return days;
  }, [initialData.year, initialData.monthNumber]);

  // Вычисляем субботы месяца
  const saturdaysOfMonth = useMemo(() => {
    if (!initialData.monthNumber || !initialData.year) return [];
    return getSaturdaysOfMonth(initialData.year, initialData.monthNumber);
  }, [initialData.year, initialData.monthNumber]);

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

  // Проверяем, изменились ли субботы
  const hasSaturdayChanges = useMemo(() => {
    const currentSorted = [...workingSaturdays].sort();
    const pendingSorted = [...pendingWorkingSaturdays].sort();
    return JSON.stringify(currentSorted) !== JSON.stringify(pendingSorted);
  }, [workingSaturdays, pendingWorkingSaturdays]);

  // Обработчик для суббот
  const handleSaturdayToggle = (dayNumber: number) => {
    setPendingWorkingSaturdays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  // Обновить субботы и пересчитать дни
  const handleUpdateSaturdays = () => {
    setWorkingSaturdays(pendingWorkingSaturdays);

    // Обновляем дни в плане на основе новых суббот
    const workingDays = getWorkingDays(
      initialData.year,
      initialData.monthNumber,
      pendingWorkingSaturdays
    );

    // Фильтруем текущие дни - оставляем только те, которые есть в новых рабочих днях
    const updatedDays = days.filter((day) => {
      const isWorking = workingDays.some(
        (wd) => wd.dayNumber === day.dayNumber
      );
      const isSpecial = specialDays.some(
        (sd) => sd.dayNumber === day.dayNumber
      );
      return isWorking || isSpecial;
    });

    // Добавляем недостающие рабочие дни
    workingDays.forEach((workingDay) => {
      const dayExists = updatedDays.some(
        (day) => day.dayNumber === workingDay.dayNumber
      );
      const isSpecial = specialDays.some(
        (sd) => sd.dayNumber === workingDay.dayNumber
      );

      if (!dayExists && !isSpecial) {
        const dayInfo = allDaysInMonth.find(
          (d) => d.dayNumber === workingDay.dayNumber
        );
        if (dayInfo) {
          const newDay: LocalDayPlan = {
            id: `day-${Math.random().toString(36).substring(2, 9)}`,
            dayNumber: workingDay.dayNumber,
            dayOfWeek: dayInfo.dayOfWeek,
            events: [],
          };
          updatedDays.push(newDay);
        }
      }
    });

    // Сортируем по номеру дня
    updatedDays.sort((a, b) => a.dayNumber - b.dayNumber);

    setDays(updatedDays);
  };

  // Отменить изменения суббот
  const handleCancelSaturdayChanges = () => {
    setPendingWorkingSaturdays(workingSaturdays);
  };

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

  // Обработчики для специальных дней
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

    // Обновляем days, добавляя специальный день
    const existingDay = days.find((d) => d.dayNumber === dayNumber);
    if (existingDay) {
      // Если день уже существует, обновляем его
      setDays((prev) =>
        prev.map((day) =>
          day.dayNumber === dayNumber
            ? {
                ...day,
                isSpecialDay: true,
                specialDayTitle: title,
                events: [
                  {
                    id: `event-special-${Math.random()
                      .toString(36)
                      .substring(2, 9)}`,
                    time: '',
                    description: title,
                    responsiblePersons: [],
                  },
                ],
              }
            : day
        )
      );
    } else {
      // Если день не существует, добавляем новый
      const newDay: LocalDayPlan = {
        id: `day-${Math.random().toString(36).substring(2, 9)}`,
        dayNumber,
        dayOfWeek: dayInfo.dayOfWeek,
        isSpecialDay: true,
        specialDayTitle: title,
        events: [
          {
            id: `event-special-${Math.random().toString(36).substring(2, 9)}`,
            time: '',
            description: title,
            responsiblePersons: [],
          },
        ],
      };
      setDays((prev) =>
        [...prev, newDay].sort((a, b) => a.dayNumber - b.dayNumber)
      );
    }
  };

  const handleSpecialDayRemove = (id: string) => {
    const specialDay = specialDays.find((sd) => sd.id === id);
    if (!specialDay) return;

    setSpecialDays((prev) => prev.filter((day) => day.id !== id));

    // Удаляем специальный день из days или преобразуем в обычный
    setDays((prev) =>
      prev
        .map((day) =>
          day.dayNumber === specialDay.dayNumber
            ? {
                ...day,
                isSpecialDay: false,
                specialDayTitle: '',
                events: [], // Очищаем события специального дня
              }
            : day
        )
        .filter(
          (day) =>
            !(day.dayNumber === specialDay.dayNumber && day.events.length === 0)
        )
    );
  };

  // Обработчики для анонсов
  const handleAnnouncementAdd = (
    dayNumber: number,
    title: string,
    style?: LocalAnnouncement['style']
  ) => {
    const newAnnouncement: LocalAnnouncement = {
      id: `announcement-${Math.random().toString(36).substring(2, 9)}`,
      dayNumber,
      title,
      style,
      order: announcements.length,
    };

    setAnnouncements((prev) => [...prev, newAnnouncement]);
  };

  const handleAnnouncementRemove = (id: string) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id)
    );
  };

  // Обработчики для таблицы
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
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, time } : event
          );

          // Проверяем валидацию после обновления
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

          // Проверяем валидацию после обновления
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

          // Проверяем валидацию после обновления
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

          // Проверяем валидацию после удаления
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

  // Обработчик отправки для редактирования
  const handleSubmit = async () => {
    if (days.length === 0) return;

    // Проверяем валидацию
    const errors = validateWorkPlan(days);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrors(true);
      return;
    }

    try {
      // Отправляем данные для обновления
      await updateWorkPlan({
        id: planId,
        data: {
          days: days.map(convertToServerDayPlan),
          announcements: announcements.map(convertToServerAnnouncement),
          workingSaturdays: workingSaturdays,
        },
      }).unwrap();

      setValidationErrors([]);
      setShowErrors(false);
      onSuccess?.();
    } catch (err) {
      console.error('Ошибка при обновлении плана:', err);
    }
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: '0 auto', p: 3 }}>
      {/* Заголовок режима редактирования */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Редактирование плана мероприятий
        </Typography>
        <Typography color="text.secondary">
          {MONTHS[initialData.monthNumber - 1]} {initialData.year}
        </Typography>
      </Box>

      {/* Первая строка: Рабочие субботы и Специальные дни */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3,
          alignItems: 'stretch',
        }}
      >
        {/* Рабочие субботы */}
        <SaturdaySelectionStep
          saturdays={saturdaysOfMonth}
          workingSaturdays={pendingWorkingSaturdays}
          selectedMonthNumber={initialData.monthNumber}
          isLoading={false}
          onSaturdayToggle={handleSaturdayToggle}
          mode="edit"
          originalSaturdays={workingSaturdays}
          hasChanges={hasSaturdayChanges}
          onUpdateSaturdays={handleUpdateSaturdays}
          onCancelChanges={handleCancelSaturdayChanges}
        />

        {/* Специальные дни */}
        <SpecialDaysStep
          allDays={allDaysInMonth}
          specialDays={specialDays}
          selectedMonthNumber={initialData.monthNumber}
          isLoading={false}
          onAddSpecialDay={handleSpecialDayAdd}
          onRemoveSpecialDay={handleSpecialDayRemove}
          title="2. Специальные дни"
        />
        <AnnouncementsStep
          allDays={allDaysInMonth}
          announcements={announcements}
          isLoading={false}
          onAddAnnouncement={handleAnnouncementAdd}
          onRemoveAnnouncement={handleAnnouncementRemove}
          title="3. Анонсы мероприятий"
        />
      </Box>

      {/* Отображение ошибок валидации */}
      <Collapse in={showErrors && validationErrors.length > 0}>
        <Box sx={{ mb: 3 }}>
          <ValidationErrors
            errors={validationErrors}
            onClose={() => setShowErrors(false)}
          />
        </Box>
      </Collapse>

      {/* Таблица с планом мероприятий */}
      {days.length > 0 && (
        <>
          <PlanTable
            days={days}
            announcements={announcements}
            monthNumber={initialData.monthNumber}
            year={initialData.year}
            error={apiError}
            isSuccess={isSuccess}
            onAddEvent={handleAddEvent}
            onUpdateEventTime={handleUpdateEventTime}
            onUpdateEventDescription={handleUpdateEventDescription}
            onUpdateEventResponsible={handleUpdateEventResponsible}
            onRemoveEvent={handleRemoveEvent}
            validationErrors={validationErrors}
            hasEmptyDays={hasEmptyDays}
            mode="edit"
          />

          <PlanActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            isDisabled={days.length === 0 || hasEmptyDays || !isPlanComplete}
            hasValidationErrors={validationErrors.length > 0}
            hasEmptyDays={hasEmptyDays}
            mode="edit"
            submitLabel="Сохранить изменения"
            cancelLabel="Отменить редактирование"
          />
        </>
      )}
    </Box>
  );
};
