// hooks/useScheduleForm.ts

import { useState, useCallback } from 'react';

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

  // Генерация месяцев на текущий и следующий год
  const generateMonthOptions = (): MonthOption[] => {
    const options: MonthOption[] = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Добавляем месяцы на текущий год
    for (let month = 0; month < 12; month++) {
      if (month >= currentMonth) {
        options.push({
          value: `${currentYear}-${(month + 1).toString().padStart(2, '0')}`,
          label: new Date(currentYear, month).toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric',
          }),
          year: currentYear,
          month: month + 1,
        });
      }
    }

    // Добавляем месяцы на следующий год
    const nextYear = currentYear + 1;
    for (let month = 0; month < 12; month++) {
      options.push({
        value: `${nextYear}-${(month + 1).toString().padStart(2, '0')}`,
        label: new Date(nextYear, month).toLocaleDateString('ru-RU', {
          month: 'long',
          year: 'numeric',
        }),
        year: nextYear,
        month: month + 1,
      });
    }

    return options;
  };

  // Обновление месяца
  const updateMonth = useCallback((month: string) => {
    setFormData((prev) => ({ ...prev, month }));
    setValidationErrors((prev) => ({ ...prev, month: undefined }));
  }, []);

  // Обновление типа графика
  const updateScheduleType = useCallback((scheduleType: 'responsibleOnWeekends' | 'safetyOfficers') => {
    setFormData((prev) => ({ ...prev, scheduleType }));
    setValidationErrors((prev) => ({ ...prev, scheduleType: undefined }));
  }, []);

  // Автозаполнение из списка сотрудников
  const autoFillFromEmployees = useCallback((employees: EmployeeType[]) => {
    const entries: ScheduleEntryForm[] = employees.map((employee, index) => ({
      id: `auto-${employee._id!.toString()}`,
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

  // Добавление пустой строки
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

  // Обновление строки
  const updateEntry = useCallback((entryId: string, updates: Partial<ScheduleEntryForm>) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries.map((entry) =>
        entry.id === entryId ? { ...entry, ...updates } : entry
      ),
    }));
  }, []);

  // Удаление строки
  const removeEntry = useCallback((entryId: string) => {
    setFormData((prev) => ({
      ...prev,
      entries: prev.entries
        .filter((entry) => entry.id !== entryId)
        .map((entry, index) => ({ ...entry, orderIndex: index })),
    }));
  }, []);

  // Добавление даты к строке
  const addDateToEntry = useCallback((entryId: string, date: string) => {
    const validation = validateDate(date, formData.month);
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
          return {
            ...entry,
            dates: [...entry.dates, date].sort(),
          };
        }
        return entry;
      }),
    }));

    // Очищаем ошибки для этой записи
    setValidationErrors((prev) => {
      const newEntries = { ...prev.entries };
      delete newEntries[entryId];
      return { ...prev, entries: newEntries };
    });
  }, [formData.month]);

  // Удаление даты из строки
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

  // Валидация формы
  const validateForm = useCallback((): boolean => {
    const errors: ScheduleValidationErrors = {};

    // Проверка месяца
    if (!formData.month) {
      errors.month = 'Выберите месяц';
    }

    // Проверка типа
    if (!formData.scheduleType) {
      errors.scheduleType = 'Выберите тип графика';
    }

    // Проверка записей
    const entryErrors: Record<string, string[]> = {};
    formData.entries.forEach((entry) => {
      const entryErrorsList: string[] = [];

      // Проверка ФИО
      if (!entry.customName.trim()) {
        entryErrorsList.push('ФИО обязательно');
      }

      // Проверка должности
      if (!entry.customJob.trim()) {
        entryErrorsList.push('Должность обязательна');
      }

      // Проверка дат
      if (entry.dates.length === 0) {
        entryErrorsList.push('Добавьте хотя бы одну дату дежурства');
      }

      // Проверка уникальности дат
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
  }, [formData]);

  // Сброс формы
  const resetForm = useCallback(() => {
    setFormData({
      month: '',
      scheduleType: 'responsibleOnWeekends',
      entries: [],
    });
    setValidationErrors({});
  }, []);

  return {
    formData,
    validationErrors,
    monthOptions: generateMonthOptions(),
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
  };
};

export const validateDate = (date: string, month: string): DateValidationResult => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {
      isValid: false,
      error: 'Неверный формат даты. Используйте ГГГГ-ММ-ДД',
    };
  }

  // Проверка, что дата принадлежит выбранному месяцу
  const dateMonth = date.substring(0, 7);
  if (dateMonth !== month) {
    return {
      isValid: false,
      error: `Дата должна принадлежать месяцу ${month}`,
    };
  }

  // Проверка, что дата в будущем или текущем месяце
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
};