import React, { useMemo } from 'react';
import { Box, Collapse, Typography } from '@mui/material';
import { useUpdateWorkPlanMutation } from '@store/slices';
import { MONTHS } from '@utils/dateUtils';
import {
  getSaturdaysOfMonth,
  DAYS_OF_WEEK,
  getDaysInMonth,
  getWorkingDays,
} from '@utils/dateUtils';
import { useWorkPlanBase } from '@hooks/useWorkPlanBase';
import {
  convertLocalDayToServer,
  convertLocalAnnouncementToServer,
} from '@utils/workPlanConverters';
import {
  convertServerDaysToLocal,
  convertServerAnnouncementsToLocal,
} from '@utils/workPlanConverters';
import {
  SaturdaySelectionStep,
  SpecialDaysStep,
  AnnouncementsStep,
} from './creationSteps';
import PlanActions from './planActions';
import PlanTable from './table/planTable';
import ValidationErrors from './validationErrors';
import {
  DayPlan,
  Announcement,
  SpecialDay,
  LocalDayPlan,
} from 'src/types/workPlan.types';

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
  // Извлекаем специальные дни из начальных данных
  const initialSpecialDays: SpecialDay[] = useMemo(() => {
    return initialData.days
      .filter((day) => day.isSpecialDay && day.specialDayTitle)
      .map((day) => ({
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.specialDayTitle!,
        dayOfWeek: day.dayOfWeek,
      }));
  }, [initialData.days]);

  // Используем базовый хук с начальными данными
  const {
    days,
    announcements,
    specialDays,
    workingSaturdays,
    setDays,
    addEvent,
    updateEventTime,
    updateEventDescription,
    updateEventResponsible,
    removeEvent,
    handleAnnouncementAdd,
    handleAnnouncementRemove,
    handleSpecialDayAdd,
    handleSpecialDayRemove,
    handleWorkingSaturdaysUpdate,
    validation,
    stateChecks,
  } = useWorkPlanBase({
    initialDays: convertServerDaysToLocal(initialData.days),
    initialAnnouncements: convertServerAnnouncementsToLocal(
      initialData.announcements
    ),
    initialSpecialDays,
    initialWorkingSaturdays: initialData.workingSaturdays || [],
    autoValidate: false,
  });

  // Состояние для временных суббот
  const [pendingWorkingSaturdays, setPendingWorkingSaturdays] = React.useState<
    number[]
  >(initialData.workingSaturdays || []);

  // API для обновления плана
  const [
    updateWorkPlan,
    { isLoading: isUpdating, error: apiError, isSuccess },
  ] = useUpdateWorkPlanMutation();

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

  // Обновить субботы и пересчитать дни - ИСПРАВЛЕННАЯ ВЕРСИЯ
  const handleUpdateSaturdays = () => {
    // Обновляем субботы через хук
    handleWorkingSaturdaysUpdate(pendingWorkingSaturdays);

    // Обновляем дни в плане на основе новых суббот
    const workingDays = getWorkingDays(
      initialData.year,
      initialData.monthNumber,
      pendingWorkingSaturdays
    );

    // Фильтруем текущие дни - оставляем только те, которые есть в новых рабочих днях или являются специальными
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

  // Обработчик добавления специального дня
  const handleSpecialDayAddWithLogic = (dayNumber: number, title: string) => {
    const dayInfo = allDaysInMonth.find((d) => d.dayNumber === dayNumber);
    if (!dayInfo) return;

    // Добавляем специальный день через хук
    handleSpecialDayAdd(dayNumber, title, dayInfo.dayOfWeek);

    // Проверяем, существует ли уже день с таким номером
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

  // Обработчик удаления специального дня
  const handleSpecialDayRemoveWithLogic = (id: string) => {
    const specialDay = specialDays.find((sd) => sd.id === id);
    if (!specialDay) return;

    // Удаляем специальный день через хук
    handleSpecialDayRemove(id);

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

  // Обработчик отправки для редактирования
  const handleSubmit = async () => {
    if (days.length === 0) return;

    // Проверяем валидацию
    const errors = validation.validate();
    if (errors.length > 0) {
      validation.setShowErrors(true);
      return;
    }

    try {
      // Отправляем данные для обновления
      await updateWorkPlan({
        id: planId,
        data: {
          days: days.map(convertLocalDayToServer),
          announcements: announcements.map(convertLocalAnnouncementToServer),
          workingSaturdays: workingSaturdays,
        },
      }).unwrap();

      validation.clearErrors();
      onSuccess?.();
    } catch (err) {
      console.error('Ошибка при обновлении плана:', err);
    }
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
          onAddSpecialDay={handleSpecialDayAddWithLogic}
          onRemoveSpecialDay={handleSpecialDayRemoveWithLogic}
          title="2. Специальные дни"
        />

        {/* Анонсы */}
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
      <Collapse in={validation.showErrors && validation.errors.length > 0}>
        <Box sx={{ mb: 3 }}>
          <ValidationErrors
            errors={validation.errors}
            onClose={() => validation.setShowErrors(false)}
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
            onAddEvent={(dayId) => addEvent(dayId, false)}
            onUpdateEventTime={updateEventTime}
            onUpdateEventDescription={updateEventDescription}
            onUpdateEventResponsible={updateEventResponsible}
            onRemoveEvent={(dayId, eventId) =>
              removeEvent(dayId, eventId, false)
            }
            validationErrors={validation.errors}
            hasEmptyDays={stateChecks.hasEmptyDays}
            mode="edit"
          />

          <PlanActions
            onCancel={onCancel || (() => {})}
            onSubmit={handleSubmit}
            isSubmitting={isUpdating}
            isDisabled={
              days.length === 0 ||
              stateChecks.hasEmptyDays ||
              !stateChecks.isPlanComplete
            }
            hasValidationErrors={validation.errors.length > 0}
            hasEmptyDays={stateChecks.hasEmptyDays}
            mode="edit"
            submitLabel="Сохранить изменения"
            cancelLabel="Отменить редактирование"
          />
        </>
      )}
    </Box>
  );
};
