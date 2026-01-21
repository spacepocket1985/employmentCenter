import { useState, useCallback, useEffect } from 'react';
import { LocalDayPlan } from 'src/types/workPlan.types';
import { validateWorkPlan, ValidationError } from '@utils/validationPlan';

interface UseWorkPlanValidationProps {
  days: LocalDayPlan[];
  autoValidate?: boolean;
}

interface UseWorkPlanValidationReturn {
  validationErrors: ValidationError[];
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
  setValidationErrors: (errors: ValidationError[]) => void;
}

export const useWorkPlanValidation = ({
  days,
  autoValidate = true,
}: UseWorkPlanValidationProps): UseWorkPlanValidationReturn => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showErrors, setShowErrors] = useState(false);

  // Автоматическая валидация при изменении дней
  useEffect(() => {
    if (autoValidate && days.length > 0) {
      const errors = validateWorkPlan(days);
      setValidationErrors(errors);
    }
  }, [days, autoValidate]);

  const validate = useCallback((): ValidationError[] => {
    const errors = validateWorkPlan(days);
    setValidationErrors(errors);
    return errors;
  }, [days]);

  const clearErrors = useCallback(() => {
    setValidationErrors([]);
    setShowErrors(false);
  }, []);

  const hasErrors = useCallback(() => {
    return validationErrors.length > 0;
  }, [validationErrors]);

  const getErrorsForDay = useCallback(
    (dayNumber: number): ValidationError[] => {
      return validationErrors.filter((error) => error.dayNumber === dayNumber);
    },
    [validationErrors]
  );

  const getErrorsForEvent = useCallback(
    (dayNumber: number, eventIndex: number): ValidationError[] => {
      return validationErrors.filter(
        (error) =>
          error.dayNumber === dayNumber && error.eventIndex === eventIndex
      );
    },
    [validationErrors]
  );

  return {
    validationErrors,
    showErrors,
    setShowErrors,
    validate,
    clearErrors,
    hasErrors,
    getErrorsForDay,
    getErrorsForEvent,
    setValidationErrors,
  };
};
