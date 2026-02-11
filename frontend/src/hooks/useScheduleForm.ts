import {
  useForm,
  useFieldArray,
  UseFormReturn,
  FieldArrayWithId,
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';
import {
  ScheduleEntryForm,
  MonthOption,
  ScheduleFormValues,
  ScheduleType,
} from 'src/types/schedule.types';
import { EmployeeType } from 'src/types/types';
import { scheduleFormSchema } from '@utils/scheduleValidationSchema';

// Создаем адаптированный тип для entries, который соответствует схеме валидации
type ScheduleFormEntry = {
  id: string;
  employeeId?: string;
  customName: string;
  customJob: string;
  dates: string[];
  orderIndex: number;
};

interface UseScheduleFormReturn {
  formMethods: UseFormReturn<ScheduleFormValues>;
  monthOptions: MonthOption[];
  fields: FieldArrayWithId<ScheduleFormValues, 'entries', 'id'>[];
  appendEntry: (entry: Omit<ScheduleEntryForm, 'id'>) => void;
  removeEntry: (index: number) => void;
  autoFillFromEmployees: (employees: EmployeeType[]) => void;
  resetForm: () => void;
}

/**
 * Хук для управления формой создания графика с использованием react-hook-form
 * Исправление: Корректная типизация для работы со схемой валидации
 */
export const useScheduleForm = (): UseScheduleFormReturn => {
  // Используем ScheduleFormValues для типизации формы
  const formMethods = useForm<ScheduleFormValues>({
    resolver: yupResolver(scheduleFormSchema),
    defaultValues: {
      month: '',
      scheduleType: '' as ScheduleType,
      entries: [],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: formMethods.control,
    name: 'entries',
  });

  /**
   * Генерация списка месяцев на текущий и следующий год
   */
  const generateMonthOptions = useMemo((): MonthOption[] => {
    const options: MonthOption[] = [];
    const currentDate = new Date();
    const currentYear: number = currentDate.getFullYear();
    const currentMonth: number = currentDate.getMonth() + 1;

    for (let month = currentMonth; month <= 12; month++) {
      const date = new Date(currentYear, month - 1);
      options.push({
        value: `${currentYear}-${month.toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        }),
        year: currentYear,
        month,
      });
    }

    const nextYear: number = currentYear + 1;
    for (let month = 1; month <= 12; month++) {
      const date = new Date(nextYear, month - 1);
      options.push({
        value: `${nextYear}-${month.toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        }),
        year: nextYear,
        month,
      });
    }

    return options;
  }, []);

  /**
   * Добавление новой записи в график
   */
  const appendEntry = useCallback(
    (entry: Omit<ScheduleEntryForm, 'id'>): void => {
      const newEntry: ScheduleFormEntry = {
        ...entry,
        id: `manual-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 11)}`,
      };

      append(newEntry);
    },
    [append]
  );

  /**
   * Удаление записи по индексу
   */
  const removeEntry = useCallback(
    (index: number): void => {
      remove(index);

      const currentEntries: ScheduleFormEntry[] = formMethods.getValues(
        'entries'
      ) as ScheduleFormEntry[];
      const updatedEntries: ScheduleFormEntry[] = currentEntries.map(
        (entry: ScheduleFormEntry, idx: number) => ({
          ...entry,
          orderIndex: idx,
        })
      );

      formMethods.setValue('entries', updatedEntries);
    },
    [remove, formMethods]
  );

  /**
   * Автоматическое заполнение графика из списка сотрудников
   */
  const autoFillFromEmployees = useCallback(
    (employees: EmployeeType[]): void => {
      const entries: ScheduleFormEntry[] = employees.map(
        (employee: EmployeeType, index: number) => {
          const employeeId: string = employee._id?.toString() || '';
          return {
            id: `template-${employeeId || `emp-${index}`}`,
            employeeId: employeeId || undefined,
            customName: employee.name || '',
            customJob: employee.job || '',
            dates: [],
            orderIndex: index,
            isFromTemplate: true,
          };
        }
      );

      replace(entries);
    },
    [replace]
  );

  /**
   * Сброс формы к начальному состоянию
   */
  const resetForm = useCallback((): void => {
    formMethods.reset({
      month: '',
      scheduleType: '' as ScheduleType,
      entries: [],
    });
  }, [formMethods]);

  return {
    formMethods,
    monthOptions: generateMonthOptions,
    fields,
    appendEntry,
    removeEntry,
    autoFillFromEmployees,
    resetForm,
  };
};
