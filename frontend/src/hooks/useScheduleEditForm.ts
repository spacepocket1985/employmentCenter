// file name: useScheduleEditForm.ts
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  ScheduleFormValues,
  ScheduleModel,
  ScheduleEntryForm,
  ScheduleEntryApi,
} from 'src/types/schedule.types';

interface UseScheduleEditFormProps {
  scheduleData?: ScheduleModel;
  formMethods: UseFormReturn<ScheduleFormValues>;
  isLoading: boolean;
  loadFormData: (data: ScheduleFormValues) => void;
}

/**
 * Хук для заполнения формы редактирования данными из API
 * Преобразует ScheduleModel (из API) в ScheduleFormValues (для формы)
 */
export const useScheduleEditForm = ({
  scheduleData,
  formMethods,
  isLoading,
  loadFormData,
}: UseScheduleEditFormProps): void => {
  const { trigger } = formMethods;

  useEffect(() => {
    if (isLoading || !scheduleData) {
      return;
    }

    console.log('📥 Заполнение формы данными из API:', scheduleData);

    // Преобразуем API данные в формат формы
    const entries: ScheduleEntryForm[] = scheduleData.entries.map(
      (entry: ScheduleEntryApi) => {
        // Извлекаем ID сотрудника из объекта, если нужно
        let employeeId: string | undefined = undefined;
        if (entry.employeeId) {
          if (typeof entry.employeeId === 'object' && '_id' in entry.employeeId) {
            employeeId = entry.employeeId._id;
          } else if (typeof entry.employeeId === 'string') {
            employeeId = entry.employeeId;
          }
        }

        return {
          id: entry._id, // Важно! API присылает _id, форма ожидает id
          employeeId,
          customName: entry.customName || '',
          customJob: entry.customJob || '',
          dates: [...entry.dates].sort(), // Сортируем для консистентности
          orderIndex: entry.orderIndex,
        };
      }
    );

    // Подготавливаем данные для формы
    const formData: ScheduleFormValues = {
      month: scheduleData.month,
      scheduleType: scheduleData.scheduleType,
      entries,
    };

    console.log('🔄 Преобразованные данные для формы:', formData);

    // Загружаем данные в форму через хук
    loadFormData(formData);

    // Валидируем форму после загрузки
    setTimeout(() => {
      trigger().then((isValid) => {
        console.log('✅ Форма после валидации:', isValid);
        if (!isValid) {
          console.log('❌ Ошибки валидации:', formMethods.formState.errors);
        }
      });
    }, 100);
  }, [scheduleData, isLoading, loadFormData, trigger, formMethods.formState.errors]);
};