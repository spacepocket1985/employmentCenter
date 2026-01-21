import React, { useState } from 'react';
import { Box, Collapse } from '@mui/material';
import { useCreateWorkPlanMutation } from '@store/slices';
import { MONTHS } from '@utils/dateUtils';
import { getWorkingDays } from '@utils/dateUtils';
import { useWorkPlanCreation } from '@hooks/useWorkPlanCreation';
import { 
  MonthSelectionStep, 
  SaturdaySelectionStep, 
  PlaceholderStep, 
  AnnouncementsStep, 
  TemplateActionsStep, 
  SpecialDaysStep 
} from './creationSteps';
import PlanActions from './planActions';
import ValidationErrors from './validationErrors';
import PlanTable from './table/planTable';
import { LocalDayPlan } from 'src/types/workPlan.types';
import { useWorkPlanBase } from '@hooks/useWorkPlanBase';
import { convertLocalDayToServer, convertLocalAnnouncementToServer } from '@utils/workPlanConverters';


const WorkPlanPanel: React.FC = () => {
  const {
    // Состояния из старого хука
    selectedMonth,
    selectedMonthNumber,
    selectedYear,
    isLoadingPlans,

    // Вычисляемые значения
    availableMonths,
    saturdaysOfMonth,
    allDaysInMonth,

    // Обработчики из старого хука
    handleMonthSelect,
    handleResetAll: resetOldHookData,
  } = useWorkPlanCreation();

  // Используем новый базовый хук
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
    handleWorkingSaturdayToggle,
    validation,
    stateChecks,
    resetAll: resetBaseData
  } = useWorkPlanBase();

  // Состояние для отслеживания создания шаблона
  const [isTemplateCreated, setIsTemplateCreated] = useState(false);

  // API для создания плана
  const [
    createWorkPlan,
    { isLoading: isCreating, error: apiError, isSuccess }
  ] = useCreateWorkPlanMutation();

  // Обработчик создания шаблона - исправленная версия
  const handleCreateTemplate = () => {
    if (!selectedMonthNumber || !selectedYear) return;

    const workingDays = getWorkingDays(
      selectedYear,
      selectedMonthNumber,
      workingSaturdays
    );

    // Создаем массив всех дней месяца с правильными типами
    const allDays: LocalDayPlan[] = allDaysInMonth.map((day) => {
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
          dayOfWeek: day.dayOfWeek, // Исправлено: должно быть string, а не number
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
          dayOfWeek: day.dayOfWeek, // Исправлено: должно быть string, а не number
          events: [],
        };
      } else {
        // Нерабочий день (без мероприятий)
        return {
          id: `day-${Math.random().toString(36).substring(2, 9)}`,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek, // Исправлено: должно быть string, а не number
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

    setDays(daysToShow);
    setIsTemplateCreated(true);
    validation.clearErrors();
  };

  // Обработчик сброса всех данных
  const handleResetAll = () => {
    resetBaseData();
    resetOldHookData();
    setIsTemplateCreated(false);
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (!selectedMonthNumber || !selectedYear || days.length === 0) return;

    // Проверяем валидацию
    const errors = validation.validate();
    if (errors.length > 0) {
      validation.setShowErrors(true);
      return;
    }

    const planData = {
      month: MONTHS[selectedMonthNumber - 1],
      monthNumber: selectedMonthNumber,
      year: selectedYear,
      days: days.map(convertLocalDayToServer),
      announcements: announcements.map(convertLocalAnnouncementToServer),
      workingSaturdays,
    };

    try {
      await createWorkPlan(planData).unwrap();
      validation.clearErrors();
      handleResetAll();
    } catch (err) {
      console.error('Ошибка при создании плана:', err);
    }
  };

  // Обработчик отмены
  const handleCancel = () => {
    setDays([]);
    setIsTemplateCreated(false);
    validation.clearErrors();
  };

  // Обработчик выбора субботы с обновлением локального состояния
  const handleSaturdayToggleWithUpdate = (dayNumber: number) => {
    handleWorkingSaturdayToggle(dayNumber);
  };

  // Обработчик добавления специального дня с обновлением локального состояния
  const handleSpecialDayAddWithUpdate = (dayNumber: number, title: string) => {
    const dayInfo = allDaysInMonth.find((d) => d.dayNumber === dayNumber);
    if (dayInfo) {
      handleSpecialDayAdd(dayNumber, title, dayInfo.dayOfWeek);
    }
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
            onSaturdayToggle={handleSaturdayToggleWithUpdate}
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
            onAddSpecialDay={handleSpecialDayAddWithUpdate}
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
      <Collapse in={validation.showErrors && validation.errors.length > 0}>
        <Box sx={{ mb: 3 }}>
          <ValidationErrors
            errors={validation.errors}
            onClose={() => validation.setShowErrors(false)}
          />
        </Box>
      </Collapse>

      {isTemplateCreated && days.length > 0 && (
        <>
          <PlanTable
            days={days}
            announcements={announcements}
            monthNumber={selectedMonthNumber}
            year={selectedYear}
            error={apiError}
            isSuccess={isSuccess}
            onAddEvent={addEvent}
            onUpdateEventTime={updateEventTime}
            onUpdateEventDescription={updateEventDescription}
            onUpdateEventResponsible={updateEventResponsible}
            onRemoveEvent={removeEvent}
            validationErrors={validation.errors}
            hasEmptyDays={stateChecks.hasEmptyDays}
          />

          <PlanActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            isDisabled={days.length === 0 || stateChecks.hasEmptyDays || !stateChecks.isPlanComplete}
            hasValidationErrors={validation.errors.length > 0}
          />
        </>
      )}
    </Box>
  );
};

export default WorkPlanPanel;