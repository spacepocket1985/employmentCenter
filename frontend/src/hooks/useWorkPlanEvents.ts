import { useState, useCallback } from 'react';
import { LocalDayPlan, LocalEvent } from 'src/types/workPlan.types';
import { validateWorkPlan, ValidationError } from '@utils/validationPlan';

interface UseWorkPlanEventsProps {
  initialDays?: LocalDayPlan[];
  onValidationChange?: (errors: ValidationError[]) => void;
}

export const useWorkPlanEvents = ({
  initialDays = [],
  onValidationChange,
}: UseWorkPlanEventsProps = {}): {
  days: LocalDayPlan[];
  setDays: React.Dispatch<React.SetStateAction<LocalDayPlan[]>>;
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
} => {
  const [days, setDays] = useState<LocalDayPlan[]>(initialDays);

  const updateDaysAndValidate = useCallback(
    (updatedDays: LocalDayPlan[]) => {
      setDays(updatedDays);

      // Запускаем валидацию асинхронно
      setTimeout(() => {
        const errors = validateWorkPlan(updatedDays);
        onValidationChange?.(errors);
      }, 0);
    },
    [onValidationChange]
  );

  const addEvent = useCallback(
    (dayId: string, allowForSpecialDays: boolean = false) => {
      setDays((prev) =>
        prev.map((day) => {
          if (day.id === dayId && (allowForSpecialDays || !day.isSpecialDay)) {
            const newEvent: LocalEvent = {
              id: `event-${Math.random().toString(36).substring(2, 9)}`,
              time: '',
              description: '',
              responsiblePersons: [],
            };
            const updatedDay = { ...day, events: [...day.events, newEvent] };
            updateDaysAndValidate(
              prev.map((d) => (d.id === dayId ? updatedDay : d))
            );
            return updatedDay;
          }
          return day;
        })
      );
    },
    [updateDaysAndValidate]
  );

  const updateEventTime = useCallback(
    (dayId: string, eventId: string, time: string) => {
      setDays((prev) => {
        const updatedDays = prev.map((day) => {
          if (day.id === dayId) {
            return {
              ...day,
              events: day.events.map((event) =>
                event.id === eventId ? { ...event, time } : event
              ),
            };
          }
          return day;
        });
        updateDaysAndValidate(updatedDays);
        return updatedDays;
      });
    },
    [updateDaysAndValidate]
  );

  const updateEventDescription = useCallback(
    (dayId: string, eventId: string, description: string) => {
      setDays((prev) => {
        const updatedDays = prev.map((day) => {
          if (day.id === dayId) {
            return {
              ...day,
              events: day.events.map((event) =>
                event.id === eventId ? { ...event, description } : event
              ),
            };
          }
          return day;
        });
        updateDaysAndValidate(updatedDays);
        return updatedDays;
      });
    },
    [updateDaysAndValidate]
  );

  const updateEventResponsible = useCallback(
    (dayId: string, eventId: string, responsiblePersons: string[]) => {
      setDays((prev) => {
        const updatedDays = prev.map((day) => {
          if (day.id === dayId) {
            return {
              ...day,
              events: day.events.map((event) =>
                event.id === eventId ? { ...event, responsiblePersons } : event
              ),
            };
          }
          return day;
        });
        updateDaysAndValidate(updatedDays);
        return updatedDays;
      });
    },
    [updateDaysAndValidate]
  );

  const removeEvent = useCallback(
    (dayId: string, eventId: string, allowForSpecialDays: boolean = false) => {
      setDays((prev) => {
        const updatedDays = prev.map((day) => {
          if (day.id === dayId && (allowForSpecialDays || !day.isSpecialDay)) {
            return {
              ...day,
              events: day.events.filter((event) => event.id !== eventId),
            };
          }
          return day;
        });
        updateDaysAndValidate(updatedDays);
        return updatedDays;
      });
    },
    [updateDaysAndValidate]
  );

  return {
    days,
    setDays,
    addEvent,
    updateEventTime,
    updateEventDescription,
    updateEventResponsible,
    removeEvent,
  };
};
