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

interface UseScheduleFormReturn {
  formMethods: UseFormReturn<ScheduleFormValues>;
  monthOptions: MonthOption[];
  fields: FieldArrayWithId<ScheduleFormValues, 'entries', 'id'>[];
  appendEntry: (entry: Omit<ScheduleEntryForm, 'id'>) => void;
  removeEntry: (index: number) => void;
  autoFillFromEmployees: (employees: EmployeeType[]) => void;
  resetForm: () => void;
  loadFormData: (data: ScheduleFormValues) => void;
}

/**
 * Хук для управления формой создания/редактирования графика
 */
export const useScheduleForm = (): UseScheduleFormReturn => {
  const formMethods = useForm<ScheduleFormValues>({
    resolver: yupResolver(scheduleFormSchema) as never,
    defaultValues: {
      month: '',
      scheduleType: '' as ScheduleType,
      entries: [],
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: formMethods.control,
    name: 'entries',
  });

  /**
   * Генерация списка месяцев
   */
  const generateMonthOptions = useMemo((): MonthOption[] => {
    const options: MonthOption[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

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

    const nextYear = currentYear + 1;
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
   * Добавление новой пустой строки
   * БЕЗ employeeId - это ручной ввод
   */
  const appendEntry = useCallback(
    (entry: Omit<ScheduleEntryForm, 'id'>): void => {
      const newEntry: ScheduleEntryForm = {
        ...entry,
        id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      };
      delete newEntry.employeeId; // У ручного ввода нет employeeId
      append(newEntry);
      
      setTimeout(() => {
        formMethods.trigger('entries');
      }, 0);
    },
    [append, formMethods]
  );

  /**
   * Удаление записи
   */
  const removeEntry = useCallback(
    (index: number): void => {
      remove(index);
      
      const currentEntries = formMethods.getValues('entries');
      const updatedEntries = currentEntries.map((entry, idx) => ({
        ...entry,
        orderIndex: idx,
      }));
      
      formMethods.setValue('entries', updatedEntries, { 
        shouldValidate: true,
        shouldDirty: true 
      });
    },
    [remove, formMethods]
  );

 /**
 * Автоматическое заполнение из сотрудников
 * ID с префиксом 'template-' - запись из шаблона, но еще не сохранена в БД
 */
const autoFillFromEmployees = useCallback(
  (employees: EmployeeType[]): void => {
    const entries: ScheduleEntryForm[] = employees.map(
      (employee, index) => ({
        id: `template-${employee._id || `emp-${index}`}-${Date.now()}`,
        employeeId: employee._id,
        customName: employee.name || '',
        customJob: employee.job || '',
        dates: [],
        orderIndex: index,
      })
    );
    replace(entries);
    
    setTimeout(() => {
      formMethods.trigger('entries');
    }, 0);
  },
  [replace, formMethods]
);

  /**
   * Сброс формы
   */
  const resetForm = useCallback((): void => {
    formMethods.reset({
      month: '',
      scheduleType: '' as ScheduleType,
      entries: [],
    });
  }, [formMethods]);

  /**
   * Загрузка данных для редактирования
   */
  const loadFormData = useCallback(
    (data: ScheduleFormValues): void => {
      formMethods.reset(data, {
        keepDirty: false,
        keepValues: false,
        keepDefaultValues: false,
        keepErrors: false,
        keepIsSubmitted: false,
        keepTouched: false,
        keepIsValid: false,
        keepSubmitCount: false,
      });
      
      setTimeout(() => {
        formMethods.trigger();
      }, 0);
    },
    [formMethods]
  );

  return {
    formMethods,
    monthOptions: generateMonthOptions,
    fields,
    appendEntry,
    removeEntry,
    autoFillFromEmployees,
    resetForm,
    loadFormData,
  };
};