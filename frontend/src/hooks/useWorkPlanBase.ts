import { useState, useCallback } from 'react';
import {
  LocalDayPlan,
  LocalAnnouncement,
  SpecialDay,
} from 'src/types/workPlan.types';
import { useWorkPlanEvents } from './useWorkPlanEvents';
import { useWorkPlanValidation } from './useWorkPlanValidation';
import { useWorkPlanStateChecks } from './useWorkPlanStateChecks';
import { ValidationError } from '@utils/validationPlan';

interface UseWorkPlanBaseProps {
  initialDays?: LocalDayPlan[];
  initialAnnouncements?: LocalAnnouncement[];
  initialSpecialDays?: SpecialDay[];
  initialWorkingSaturdays?: number[];
  autoValidate?: boolean;
}

interface UseWorkPlanBaseReturn {
  // Состояния
  days: LocalDayPlan[];
  announcements: LocalAnnouncement[];
  specialDays: SpecialDay[];
  workingSaturdays: number[];

  // Сеттеры
  setDays: React.Dispatch<React.SetStateAction<LocalDayPlan[]>>;
  setAnnouncements: React.Dispatch<React.SetStateAction<LocalAnnouncement[]>>;
  setSpecialDays: React.Dispatch<React.SetStateAction<SpecialDay[]>>;
  setWorkingSaturdays: React.Dispatch<React.SetStateAction<number[]>>;

  // Обработчики событий
  addEvent: (dayId: string, allowForSpecialDays?: boolean) => void;
  updateEventTime: (dayId: string, eventId: string, time: string) => void;
  updateEventDescription: (
    dayId: string,
    eventId: string,
    description: string
  ) => void;
  updateEventResponsible: (
    dayId: string,
    eventId: string,
    responsiblePersons: string[]
  ) => void;
  removeEvent: (
    dayId: string,
    eventId: string,
    allowForSpecialDays?: boolean
  ) => void;

  // Обработчики анонсов
  handleAnnouncementAdd: (
    dayNumber: number,
    title: string,
    style?: LocalAnnouncement['style']
  ) => void;
  handleAnnouncementRemove: (id: string) => void;
  handleAnnouncementUpdate: (
    id: string,
    updates: Partial<LocalAnnouncement>
  ) => void;

  // Обработчики специальных дней
  handleSpecialDayAdd: (
    dayNumber: number,
    title: string,
    dayOfWeek: string
  ) => void;
  handleSpecialDayRemove: (id: string) => void;

  // Обработчики рабочих суббот
  handleWorkingSaturdayToggle: (dayNumber: number) => void;
  handleWorkingSaturdaysUpdate: (newSaturdays: number[]) => void;

  // Валидация
  validation: {
    errors: ValidationError[];
    showErrors: boolean;
    setShowErrors: (show: boolean) => void;
    validate: () => ValidationError[];
    clearErrors: () => void;
    hasErrors: () => boolean;
    getErrorsForDay: (dayNumber: number) => ValidationError[];
    getErrorsForEvent: (
      dayNumber: number,
      eventIndex: number
    ) => ValidationError[];
  };

  // Проверки состояния
  stateChecks: {
    hasEmptyDays: boolean;
    hasDays: boolean;
    isPlanComplete: boolean;
    daysWithEventsCount: number;
    specialDaysCount: number;
    totalEventsCount: number;
    emptyDayIds: string[];
    specialDayIds: string[];
  };

  // Утилиты
  resetAll: () => void;
}

export const useWorkPlanBase = ({
  initialDays = [],
  initialAnnouncements = [],
  initialSpecialDays = [],
  initialWorkingSaturdays = [],
  autoValidate = true,
}: UseWorkPlanBaseProps = {}): UseWorkPlanBaseReturn => {
  // Состояния
  const [announcements, setAnnouncements] =
    useState<LocalAnnouncement[]>(initialAnnouncements);
  const [specialDays, setSpecialDays] =
    useState<SpecialDay[]>(initialSpecialDays);
  const [workingSaturdays, setWorkingSaturdays] = useState<number[]>(
    initialWorkingSaturdays
  );

  // Хук валидации
  const validation = useWorkPlanValidation({
    days: initialDays, // передаем initialDays, но будем обновлять через события
    autoValidate,
  });

  // Хук событий
  const {
    days,
    setDays,
    addEvent,
    updateEventTime,
    updateEventDescription,
    updateEventResponsible,
    removeEvent,
  } = useWorkPlanEvents({
    initialDays,
    onValidationChange: (errors: ValidationError[]) => {
      validation.setValidationErrors(errors);
    },
  });

  // Хук проверок состояния
  const stateChecks = useWorkPlanStateChecks({
    days,
    includeValidation: autoValidate,
  });

  // Обработчики для анонсов
  const handleAnnouncementAdd = useCallback(
    (dayNumber: number, title: string, style?: LocalAnnouncement['style']) => {
      const newAnnouncement: LocalAnnouncement = {
        id: `announcement-${Math.random().toString(36).substring(2, 9)}`,
        dayNumber,
        title,
        style,
        order: announcements.length,
      };

      setAnnouncements((prev) => [...prev, newAnnouncement]);
    },
    [announcements.length]
  );

  const handleAnnouncementRemove = useCallback((id: string) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id)
    );
  }, []);

  const handleAnnouncementUpdate = useCallback(
    (id: string, updates: Partial<LocalAnnouncement>) => {
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === id
            ? { ...announcement, ...updates }
            : announcement
        )
      );
    },
    []
  );

  // Обработчики для специальных дней
  const handleSpecialDayAdd = useCallback(
    (dayNumber: number, title: string, dayOfWeek: string) => {
      const newSpecialDay: SpecialDay = {
        id: `special-${Math.random().toString(36).substring(2, 9)}`,
        dayNumber,
        title,
        dayOfWeek,
      };

      setSpecialDays((prev) => [...prev, newSpecialDay]);
    },
    []
  );

  const handleSpecialDayRemove = useCallback((id: string) => {
    setSpecialDays((prev) => prev.filter((day) => day.id !== id));
  }, []);

  // Обработчики для рабочих суббот
  const handleWorkingSaturdayToggle = useCallback((dayNumber: number) => {
    setWorkingSaturdays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  }, []);

  const handleWorkingSaturdaysUpdate = useCallback((newSaturdays: number[]) => {
    setWorkingSaturdays(newSaturdays);
  }, []);

  // Сброс всех данных
  const resetAll = useCallback(() => {
    setDays([]);
    setAnnouncements([]);
    setSpecialDays([]);
    setWorkingSaturdays([]);
    validation.clearErrors();
  }, [setDays, validation]);

  return {
    // Состояния
    days,
    announcements,
    specialDays,
    workingSaturdays,

    // Сеттеры
    setDays,
    setAnnouncements,
    setSpecialDays,
    setWorkingSaturdays,

    // Обработчики событий
    addEvent,
    updateEventTime,
    updateEventDescription,
    updateEventResponsible,
    removeEvent,

    // Обработчики анонсов
    handleAnnouncementAdd,
    handleAnnouncementRemove,
    handleAnnouncementUpdate,

    // Обработчики специальных дней
    handleSpecialDayAdd,
    handleSpecialDayRemove,

    // Обработчики рабочих суббот
    handleWorkingSaturdayToggle,
    handleWorkingSaturdaysUpdate,

    // Валидация
    validation: {
      errors: validation.validationErrors,
      showErrors: validation.showErrors,
      setShowErrors: validation.setShowErrors,
      validate: validation.validate,
      clearErrors: validation.clearErrors,
      hasErrors: validation.hasErrors,
      getErrorsForDay: validation.getErrorsForDay,
      getErrorsForEvent: validation.getErrorsForEvent,
    },

    // Проверки состояния
    stateChecks: {
      hasEmptyDays: stateChecks.hasEmptyDays,
      hasDays: stateChecks.hasDays,
      isPlanComplete: stateChecks.isPlanComplete,
      daysWithEventsCount: stateChecks.daysWithEventsCount,
      specialDaysCount: stateChecks.specialDaysCount,
      totalEventsCount: stateChecks.totalEventsCount,
      emptyDayIds: stateChecks.emptyDayIds,
      specialDayIds: stateChecks.specialDayIds,
    },

    // Утилиты
    resetAll,
  };
};
