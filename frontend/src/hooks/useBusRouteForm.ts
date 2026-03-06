// hooks/useBusRouteForm.ts
import { useForm, useFieldArray, UseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import { BusRouteFormValues } from 'src/types/busRoute.types';
import { busRoutesValidationSchema } from '@utils/busRoutesValidationSchema';

interface UseBusRouteFormReturn {
  formMethods: UseFormReturn<BusRouteFormValues>;
  schedulesFields: BusRouteFormValues['schedules'];
  addSchedule: (period: 'morning' | 'evening') => void;
  removeSchedule: (index: number) => void;
  addVehicle: (scheduleIndex: number) => void;
  removeVehicle: (scheduleIndex: number, vehicleIndex: number) => void;
  addBusStop: (scheduleIndex: number) => void;
  removeBusStop: (scheduleIndex: number, stopIndex: number) => void;
  resetForm: () => void;
  isFormValid: boolean;
}

/**
 * Хук для управления формой маршрута с расписаниями
 */
export const useBusRouteForm = (
  defaultValues?: Partial<BusRouteFormValues>
): UseBusRouteFormReturn => {
  const formMethods: UseFormReturn<BusRouteFormValues> =
    useForm<BusRouteFormValues>({
      resolver: yupResolver(busRoutesValidationSchema),
      defaultValues: {
        routeNumber: '',
        routeName: '',
        description: '',
        schedules: [],
        isActive: true,
        ...defaultValues,
      },
      mode: 'onChange',
      reValidateMode: 'onChange',
    });

  const { control, reset, formState } = formMethods;

  // Массив расписаний
  const { fields: schedulesFields, append: appendSchedule, remove: removeSchedule } = 
    useFieldArray({
      control,
      name: 'schedules',
    });

  /**
   * Добавить новое расписание
   */
  const addSchedule = (period: 'morning' | 'evening'): void => {
    appendSchedule({
      id: uuidv4(),
      period,
      dayTypes: [],
      vehicles: [],
      busStops: [],
      notes: '',
    });
  };

  /**
   * Удалить расписание
   */
  const handleRemoveSchedule = (index: number): void => {
    removeSchedule(index);
  };

  /**
   * Добавить транспортное средство в расписание
   */
  const addVehicle = (scheduleIndex: number): void => {
    const currentVehicles = formMethods.getValues(`schedules.${scheduleIndex}.vehicles`) || [];
    
    formMethods.setValue(`schedules.${scheduleIndex}.vehicles`, [
      ...currentVehicles,
      { id: uuidv4(), model: '', capacity: undefined }
    ], { shouldValidate: true, shouldDirty: true });
  };

  /**
   * Удалить транспортное средство из расписания
   */
  const removeVehicle = (scheduleIndex: number, vehicleIndex: number): void => {
    const currentVehicles = formMethods.getValues(`schedules.${scheduleIndex}.vehicles`) || [];
    
    formMethods.setValue(
      `schedules.${scheduleIndex}.vehicles`,
      currentVehicles.filter((_, index) => index !== vehicleIndex),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  /**
   * Добавить остановку в расписание
   */
  const addBusStop = (scheduleIndex: number): void => {
    const currentStops = formMethods.getValues(`schedules.${scheduleIndex}.busStops`) || [];
    const nextOrderNumber = currentStops.length + 1;
    
    formMethods.setValue(`schedules.${scheduleIndex}.busStops`, [
      ...currentStops,
      {
        id: uuidv4(),
        orderNumber: nextOrderNumber,
        name: '',
        address: '',
        time: { type: 'simple', simpleTime: '' },
        isSpecialNote: false,
      }
    ], { shouldValidate: true, shouldDirty: true });
  };

  /**
   * Удалить остановку из расписания
   */
  const removeBusStop = (scheduleIndex: number, stopIndex: number): void => {
    const currentStops = formMethods.getValues(`schedules.${scheduleIndex}.busStops`) || [];
    
    const updatedStops = currentStops
      .filter((_, index) => index !== stopIndex)
      .map((stop, index) => ({
        ...stop,
        orderNumber: index + 1
      }));
    
    formMethods.setValue(`schedules.${scheduleIndex}.busStops`, updatedStops, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  /**
   * Сбросить форму
   */
  const resetForm = (): void => {
    reset({
      routeNumber: '',
      routeName: '',
      description: '',
      schedules: [],
      isActive: true,
    });
  };

  return {
    formMethods,
    schedulesFields,
    addSchedule,
    removeSchedule: handleRemoveSchedule,
    addVehicle,
    removeVehicle,
    addBusStop,
    removeBusStop,
    resetForm,
    isFormValid: formState.isValid,
  };
};