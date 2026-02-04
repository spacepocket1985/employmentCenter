import { useState, useCallback, useRef, useMemo } from 'react';
import {
  ScheduleFormData,
  ScheduleEntryForm,
  MonthOption,
  ScheduleValidationErrors,
  DateValidationResult,
} from 'src/types/schedule.types';
import { EmployeeType } from 'src/types/types';

export const useScheduleForm = () => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    month: '',
    scheduleType: 'responsibleOnWeekends',
    entries: [],
  });

  const [validationErrors, setValidationErrors] = useState<ScheduleValidationErrors>({});
  const dateInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  /**
   * Функция валидации даты с использованием useMemo для мемоизации
   */
  const validateDate = useCallback((date: string): DateValidationResult => {
    // Проверка формата ГГГГ-ММ-ДД
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return {
        isValid: false,
        error: 'Неверный формат даты. Используйте ГГГГ-ММ-ДД',
      };
    }

    // Проверка, что дата принадлежит выбранному месяцу
    if (formData.month) {
      const dateMonth = date.substring(0, 7);
      if (dateMonth !== formData.month) {
        return {
          isValid: false,
          error: `Дата должна принадлежать выбранному месяцу (${formData.month})`,
        };
      }
    }

    // Проверка, что дата не в прошлом (можно дежурить только на будущее)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return {
        isValid: false,
        error: 'Нельзя выбирать прошедшие даты',
      };
    }

    return { isValid: true };
  }, [formData.month]); // Теперь правильно указана зависимость

  /**
   * Генерация списка месяцев на текущий и следующий год
   */
  const generateMonthOptions = useMemo((): MonthOption[] => {
    const options: MonthOption[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    // Добавляем месяцы на текущий год, начиная с текущего
    for (let month = currentMonth; month <= 12; month++) {
      options.push({
        value: `${currentYear}-${month.toString().padStart(2, '0')}`,
        label: new Date(currentYear, month - 1).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        }),
        year: currentYear,
        month,
      });
    }

    // Добавляем все месяцы на следующий год
    const nextYear = currentYear + 1;
    for (let month = 1; month <= 12; month++) {
      options.push({
        value: `${nextYear}-${month.toString().padStart(2, '0')}`,
        label: new Date(nextYear, month - 1).toLocaleDateString('ru-RU', {
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
   * Обновление выбранного месяца
   */
  const updateMonth = useCallback((month: string) => {
    setFormData((prev) => ({ ...prev, month }));
    setValidationErrors((prev) => ({ ...prev, month: undefined }));
  }, []);

  /**
   * Обновление типа графика
   */
  const updateScheduleType = useCallback((scheduleType: 'responsibleOnWeekends' | 'safetyOfficers') => {
    setFormData((prev) => ({ ...prev, scheduleType }));
    setValidationErrors((prev) => ({ ...prev, scheduleType: undefined }));
  }, []);

  /**
   * Автозаполнение графика из списка сотрудников
   */
  const autoFillFromEmployees = useCallback((employees: EmployeeType[]) => {
    const entries: ScheduleEntryForm[] = employees.map((employee, index) => ({
      id: `template-${employee._id!.toString()}`,
      employeeId: employee._id!.toString(),
      customName: employee.name,
      customJob: employee.job,
      dates: [],
      orderIndex: index,
      isFromTemplate: true,
    }));

    setFormData((prev) => ({ ...prev, entries }));
    setValidationErrors((prev) => ({ ...prev, entries: undefined }));
  }, []);

  /**
   * Добавление пустой строки для ручного ввода
   */
  const addEmptyEntry = useCallback(() => {
    const newEntry: ScheduleEntryForm = {
      id: `manual-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      customName: '',
      customJob: '',
      dates: [],
      orderIndex: formData.entries.length,
      isFromTemplate: false,
    };

    setFormData((prev) => ({
      ...prev,
      entries: [...prev.entries, newEntry],
    }));
  }, [formData.entries.length]);

  /**
   * Обновление данных конкретной строки
   */
  const updateEntry = useCallback((entryId: string, updates: Partial<ScheduleEntryForm>) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      ),
    }));

    // Очищаем ошибки для этой записи при редактировании
    setValidationErrors((prev) => {
      const newEntries = { ...prev.entries };
      delete newEntries[entryId];
      return { ...prev, entries: newEntries };
    });
  }, []);

  /**
   * Удаление строки из графика
   */
  const removeEntry = useCallback((entryId: string) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries
        .filter((entry) => entry.id !== entryId)
        .map((entry, index) => ({ ...entry, orderIndex: index })),
    }));
  }, []);

  /**
   * Добавление даты дежурства к строке
   */
  const addDateToEntry = useCallback((entryId: string, date: string) => {
    // Валидация даты
    const validation = validateDate(date);
    if (!validation.isValid) {
      setValidationErrors((prev) => ({
        ...prev,
        entries: {
          ...prev.entries,
          [entryId]: [...(prev.entries?.[entryId] || []), validation.error || ''],
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) => {
        if (entry.id === entryId) {
          // Проверяем, нет ли уже такой даты
          if (entry.dates.includes(date)) {
            return entry;
          }
          return {
            ...entry,
            dates: [...entry.dates, date].sort(),
          };
        }
        return entry;
      }),
    }));

    // Очищаем поле ввода даты
    if (dateInputRefs.current[entryId]) {
      dateInputRefs.current[entryId]!.value = '';
    }

    // Очищаем ошибки для этой записи
    setValidationErrors((prev) => {
      const newEntries = { ...prev.entries };
      delete newEntries[entryId];
      return { ...prev, entries: newEntries };
    });
  }, [validateDate]); // Используем validateDate из зависимостей

  /**
   * Удаление даты дежурства из строки
   */
  const removeDateFromEntry = useCallback((entryId: string, dateToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) => {
        if (entry.id === entryId) {
          return {
            ...entry,
            dates: entry.dates.filter((date) => date !== dateToRemove),
          };
        }
        return entry;
      }),
    }));
  }, []);

  /**
   * Валидация всей формы перед сохранением
   */
  const validateForm = useCallback((): boolean => {
    const errors: ScheduleValidationErrors = {};

    // Проверка месяца
    if (!formData.month) {
      errors.month = 'Выберите месяц для графика';
    }

    // Проверка типа графика
    if (!formData.scheduleType) {
      errors.scheduleType = 'Выберите тип графика';
    }

    // Проверка записей
    const entryErrors: Record<string, string[]> = {};
    
    formData.entries.forEach((entry) => {
      const entryErrorsList: string[] = [];

      // Проверка ФИО
      if (!entry.customName.trim()) {
        entryErrorsList.push('Укажите ФИО сотрудника');
      }

      // Проверка должности
      if (!entry.customJob.trim()) {
        entryErrorsList.push('Укажите должность сотрудника');
      }

      // Проверка дат дежурств
      if (entry.dates.length === 0) {
        entryErrorsList.push('Добавьте хотя бы одну дату дежурства');
      }

      // Проверка уникальности дат в пределах строки
      const uniqueDates = new Set(entry.dates);
      if (uniqueDates.size !== entry.dates.length) {
        entryErrorsList.push('Удалите дублирующиеся даты');
      }

      if (entryErrorsList.length > 0) {
        entryErrors[entry.id] = entryErrorsList;
      }
    });

    if (Object.keys(entryErrors).length > 0) {
      errors.entries = entryErrors;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.month, formData.scheduleType, formData.entries]);

  /**
   * Сброс формы к начальному состоянию
   */
  const resetForm = useCallback(() => {
    setFormData({
      month: '',
      scheduleType: 'responsibleOnWeekends',
      entries: [],
    });
    setValidationErrors({});
    dateInputRefs.current = {};
  }, []);

  /**
   * Регистрация ref для поля ввода даты
   */
  const registerDateInputRef = useCallback((entryId: string, element: HTMLInputElement | null) => {
    dateInputRefs.current[entryId] = element;
  }, []);

  return {
    formData,
    validationErrors,
    monthOptions: generateMonthOptions,
    updateMonth,
    updateScheduleType,
    autoFillFromEmployees,
    addEmptyEntry,
    updateEntry,
    removeEntry,
    addDateToEntry,
    removeDateFromEntry,
    validateForm,
    resetForm,
    registerDateInputRef,
  };
};