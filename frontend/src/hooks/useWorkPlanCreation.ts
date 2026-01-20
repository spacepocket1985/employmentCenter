import { useState, useMemo } from 'react';
import { useGetAllWorkPlansQuery } from '@store/slices';
import {
  getAvailableMonths,
  getSaturdaysOfMonth,
  getDaysInMonth,
  DAYS_OF_WEEK,
} from '@utils/dateUtils';
import {
  LocalAnnouncement,
  SpecialDay,
  LocalDayPlan,
} from 'src/types/workPlan.types';

interface UseWorkPlanCreationProps {
  initialMonth?: string;
  initialYear?: number;
  // Для режима редактирования можно добавить initialData
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useWorkPlanCreation = (props?: UseWorkPlanCreationProps) => {
  // Состояния формы
  const [selectedMonth, setSelectedMonth] = useState<string>(
    props?.initialMonth || ''
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    props?.initialYear || new Date().getFullYear()
  );
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number>(0);
  const [workingSaturdays, setWorkingSaturdays] = useState<number[]>([]);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [announcements, setAnnouncements] = useState<LocalAnnouncement[]>([]);
  const [days, setDays] = useState<LocalDayPlan[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // API для получения существующих планов
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetAllWorkPlansQuery();

  // Мемоизированные вычисления
  const availableMonths = useMemo(() => {
    const existingPlans = plansData?.data || [];
    return getAvailableMonths(existingPlans);
  }, [plansData]);

  const saturdaysOfMonth = useMemo(() => {
    if (!selectedMonthNumber || !selectedYear) return [];
    return getSaturdaysOfMonth(selectedYear, selectedMonthNumber);
  }, [selectedYear, selectedMonthNumber]);

  const allDaysInMonth = useMemo(() => {
    if (!selectedMonthNumber || !selectedYear) return [];
    const daysCount = getDaysInMonth(selectedYear, selectedMonthNumber);
    const days: Array<{ dayNumber: number; dayOfWeek: string }> = [];

    for (let i = 1; i <= daysCount.length; i++) {
      const date = new Date(selectedYear, selectedMonthNumber - 1, i);
      const dayOfWeek = DAYS_OF_WEEK[date.getDay()];
      days.push({ dayNumber: i, dayOfWeek });
    }

    return days;
  }, [selectedYear, selectedMonthNumber]);

  // Обработчики
  const handleMonthSelect = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setSelectedMonth(value);
    setSelectedYear(year);
    setSelectedMonthNumber(month);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setAnnouncements([]);
    setDays([]);
    setIsSubmitted(false);
  };

  const handleSaturdayToggle = (dayNumber: number) => {
    setWorkingSaturdays((prev) =>
      prev.includes(dayNumber)
        ? prev.filter((d) => d !== dayNumber)
        : [...prev, dayNumber]
    );
  };

  const handleSpecialDayAdd = (dayNumber: number, title: string) => {
    const dayInfo = allDaysInMonth.find((d) => d.dayNumber === dayNumber);
    if (!dayInfo) return;

    const newSpecialDay: SpecialDay = {
      id: `special-${Math.random().toString(36).substring(2, 9)}`,
      dayNumber,
      title,
      dayOfWeek: dayInfo.dayOfWeek,
    };

    setSpecialDays((prev) => [...prev, newSpecialDay]);
  };

  const handleSpecialDayRemove = (id: string) => {
    setSpecialDays((prev) => prev.filter((day) => day.id !== id));
  };

  const handleAnnouncementAdd = (
    dayNumber: number,
    title: string,
    style?: LocalAnnouncement['style']
  ) => {
    const newAnnouncement: LocalAnnouncement = {
      id: `announcement-${Math.random().toString(36).substring(2, 9)}`,
      dayNumber,
      title,
      style,
      order: announcements.length,
    };

    setAnnouncements((prev) => [...prev, newAnnouncement]);
  };

  const handleAnnouncementRemove = (id: string) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id)
    );
  };

  const handleResetAll = () => {
    setSelectedMonth('');
    setSelectedYear(new Date().getFullYear());
    setSelectedMonthNumber(0);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setAnnouncements([]);
    setDays([]);
    setIsSubmitted(false);
  };

  const setTemplateDays = (templateDays: LocalDayPlan[]) => {
    setDays(templateDays);
    setIsSubmitted(true);
  };

  // Возвращаем все состояния и методы
  return {
    // Состояния
    selectedMonth,
    selectedYear,
    selectedMonthNumber,
    workingSaturdays,
    specialDays,
    announcements,
    days,
    isSubmitted,
    isLoadingPlans,

    // Вычисляемые значения
    availableMonths,
    saturdaysOfMonth,
    allDaysInMonth,

    // Обработчики
    handleMonthSelect,
    handleSaturdayToggle,
    handleSpecialDayAdd,
    handleSpecialDayRemove,
    handleAnnouncementAdd,
    handleAnnouncementRemove,
    handleResetAll,
    setTemplateDays,
    setDays,
  };
};
