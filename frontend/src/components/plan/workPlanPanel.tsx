import React, { useState, useMemo } from 'react';
import { Box, Paper, Typography, Button, Collapse } from '@mui/material';

import {
  useCreateWorkPlanMutation,
  useGetAllWorkPlansQuery,
} from '@store/slices';
import {
  getAvailableMonths,
  getSaturdaysOfMonth,
  MONTHS,
  getWorkingDays,
  getDaysInMonth,
  DAYS_OF_WEEK,
} from '@utils/dateUtils';
import { validateWorkPlan, ValidationError } from '@utils/validationPlan';

import {
  DayPlan,
  LocalDayPlan,
  LocalAnnouncement,
  Announcement,
  LocalEvent,
} from 'src/types/workPlan.types';
import MonthSelector from './monthSelector';
import PlanActions from './planActions';
import PlanTable from './planTable';
import SaturdaySelector from './saturdaySelector';
import SpecialDaysSelector from './specialDaysSelector';
import AnnouncementsSelector from './announcementsSelector'; // Новый импорт
import ValidationErrors from './validationErrors';
import { planStylesForCreate } from 'src/const';

interface SpecialDay {
  id: string;
  dayNumber: number;
  title: string;
  dayOfWeek: string;
}

const WorkPlanPanel: React.FC = () => {
  // Состояния
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number>(0);
  const [workingSaturdays, setWorkingSaturdays] = useState<number[]>([]);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [announcements, setAnnouncements] = useState<LocalAnnouncement[]>([]); // Новое состояние
  const [days, setDays] = useState<LocalDayPlan[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );
  const [showErrors, setShowErrors] = useState(false);

  // API
  const { data: plansData, isLoading: isLoadingPlans } =
    useGetAllWorkPlansQuery();
  const [
    createWorkPlan,
    { isLoading: isCreating, error: apiError, isSuccess },
  ] = useCreateWorkPlanMutation();

  // Мемоизированные значения
  const availableMonths = useMemo(() => {
    const existingPlans = plansData?.data || [];
    return getAvailableMonths(existingPlans);
  }, [plansData]);

  // Проверяем, есть ли дни без мероприятий (пункт 4)
  const hasEmptyDays = useMemo(() => {
    return days.some((day) => !day.isSpecialDay && day.events.length === 0);
  }, [days]);

  // Проверяем, все ли обязательные поля заполнены
  const isPlanComplete = useMemo(() => {
    if (days.length === 0) return false;
    if (hasEmptyDays) return false;

    const errors = validateWorkPlan(days);
    return errors.length === 0;
  }, [days, hasEmptyDays]);

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

  // Обработчики для анонсов
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
      order: announcements.length, // Порядок по умолчанию
    };

    setAnnouncements((prev) => [...prev, newAnnouncement]);
  };

  const handleAnnouncementRemove = (id: string) => {
    setAnnouncements((prev) =>
      prev.filter((announcement) => announcement.id !== id)
    );
  };

  const handleMonthSelect = (value: string) => {
    const [year, month] = value.split('-').map(Number);
    setSelectedMonth(value);
    setSelectedYear(year);
    setSelectedMonthNumber(month);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setAnnouncements([]); // Сбрасываем анонсы
    setDays([]);
    setValidationErrors([]);
    setShowErrors(false);
  };

  const handleCreateTemplate = () => {
    if (!selectedMonthNumber || !selectedYear) return;

    const workingDays = getWorkingDays(
      selectedYear,
      selectedMonthNumber,
      workingSaturdays
    );

    // Создаем массив всех дней месяца
    const allDays = allDaysInMonth.map((day) => {
      // Проверяем, является ли этот день рабочим
      const isWorkingDay = workingDays.some(
        (wd) => wd.dayNumber === day.dayNumber
      );

      // Проверяем, является ли этот день специальным
      const specialDay = specialDays.find(
        (sd) => sd.dayNumber === day.dayNumber
      );

      if (specialDay) {
        // Специальный день
        return {
          id: specialDay.id,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          isSpecialDay: true,
          specialDayTitle: specialDay.title,
          events: [
            {
              id: `event-special-${Math.random().toString(36).substring(2, 9)}`,
              time: '',
              description: specialDay.title,
              responsiblePersons: [],
            },
          ],
        };
      } else if (isWorkingDay) {
        // Рабочий день без специального мероприятия
        return {
          id: `day-${Math.random().toString(36).substring(2, 9)}`,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          events: [],
        };
      } else {
        // Нерабочий день (без мероприятий)
        return {
          id: `day-${Math.random().toString(36).substring(2, 9)}`,
          dayNumber: day.dayNumber,
          dayOfWeek: day.dayOfWeek,
          events: [],
        };
      }
    });

    // Фильтруем только дни, которые нужно показать (рабочие или специальные)
    const daysToShow = allDays.filter((day) => {
      const isWorking = workingDays.some(
        (wd) => wd.dayNumber === day.dayNumber
      );
      const isSpecial = specialDays.some(
        (sd) => sd.dayNumber === day.dayNumber
      );
      return isWorking || isSpecial;
    });

    // Сортируем по номеру дня
    daysToShow.sort((a, b) => a.dayNumber - b.dayNumber);

    setDays(daysToShow as LocalDayPlan[]);
    setValidationErrors([]);
    setShowErrors(false);
  };

  const handleResetAll = () => {
    setSelectedMonth('');
    setSelectedYear(new Date().getFullYear());
    setSelectedMonthNumber(0);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setAnnouncements([]); // Сбрасываем анонсы
    setDays([]);
    setValidationErrors([]);
    setShowErrors(false);
  };

  const convertToServerDayPlan = (localDay: LocalDayPlan): DayPlan => ({
    id: localDay.id,
    dayNumber: localDay.dayNumber,
    dayOfWeek: localDay.dayOfWeek,
    isSpecialDay: localDay.isSpecialDay,
    specialDayTitle: localDay.specialDayTitle,
    events: localDay.events.map((event) => ({
      id: event.id,
      time: event.time,
      description: event.description,
      responsiblePersons: event.responsiblePersons,
      notes: event.notes,
    })),
  });

  const convertToServerAnnouncement = (
    localAnnouncement: LocalAnnouncement
  ): Announcement => ({
    id: localAnnouncement.id,
    dayNumber: localAnnouncement.dayNumber,
    title: localAnnouncement.title,
    style: localAnnouncement.style,
    order: localAnnouncement.order,
  });

  const handleSubmit = async () => {
    if (!selectedMonthNumber || !selectedYear || days.length === 0) return;

    // Проверяем валидацию
    const errors = validateWorkPlan(days);
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowErrors(true);
      return;
    }

    const planData = {
      month: MONTHS[selectedMonthNumber - 1],
      monthNumber: selectedMonthNumber,
      year: selectedYear,
      days: days.map(convertToServerDayPlan),
      announcements: announcements.map(convertToServerAnnouncement), // Добавляем анонсы
    };

    try {
      await createWorkPlan(planData).unwrap();
      setValidationErrors([]);
      setShowErrors(false);
      setAnnouncements([]); // Очищаем анонсы после успешного сохранения
    } catch (err) {
      console.error('Ошибка при создании плана:', err);
    }
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

  const handleAddEvent = (dayId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          // Для специальных дней добавляем новое мероприятие, не трогая первое (название)
          const newEvent: LocalEvent = {
            id: `event-${Math.random().toString(36).substring(2, 9)}`,
            time: '',
            description: '',
            responsiblePersons: [],
          };
          return { ...day, events: [...day.events, newEvent] };
        }
        return day;
      })
    );
  };

  const handleUpdateEventTime = (
    dayId: string,
    eventId: string,
    time: string
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, time } : event
          );

          // Проверяем валидацию после обновления
          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: updatedEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return {
            ...day,
            events: updatedEvents,
          };
        }
        return day;
      })
    );
  };

  const handleUpdateEventDescription = (
    dayId: string,
    eventId: string,
    description: string
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, description } : event
          );

          // Проверяем валидацию после обновления
          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: updatedEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return {
            ...day,
            events: updatedEvents,
          };
        }
        return day;
      })
    );
  };

  const handleUpdateEventResponsible = (
    dayId: string,
    eventId: string,
    responsiblePersons: string[]
  ) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedEvents = day.events.map((event) =>
            event.id === eventId ? { ...event, responsiblePersons } : event
          );

          // Проверяем валидацию после обновления
          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: updatedEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return {
            ...day,
            events: updatedEvents,
          };
        }
        return day;
      })
    );
  };

  const handleRemoveEvent = (dayId: string, eventId: string) => {
    setDays((prev) =>
      prev.map((day) => {
        if (day.id === dayId && !day.isSpecialDay) {
          const newEvents = day.events.filter((event) => event.id !== eventId);

          // Проверяем валидацию после удаления
          setTimeout(() => {
            const errors = validateWorkPlan(
              prev.map((d) =>
                d.id === dayId ? { ...day, events: newEvents } : d
              )
            );
            setValidationErrors(errors);
          }, 0);

          return { ...day, events: newEvents };
        }
        return day;
      })
    );
  };

  const handleCancel = () => {
    setDays([]);
    setWorkingSaturdays([]);
    setSpecialDays([]);
    setValidationErrors([]);
    setShowErrors(false);
  };

  return (
    <Box sx={{ maxWidth: 1600, margin: '0 auto', p: 3 }}>
      {/* Первая строка: Шаги 1 и 2 */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
          mb: 3,
          alignItems: 'stretch',
        }}
      >
        {/* Шаг 1: Выбор месяца */}
        <Paper
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
          elevation={3}
        >
          <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
            1. Выберите месяц
          </Typography>
          <Box sx={{ mt: 2, flexGrow: 1 }}>
            <MonthSelector
              selectedMonth={selectedMonth}
              availableMonths={availableMonths}
              onMonthSelect={handleMonthSelect}
              isLoading={isLoadingPlans}
            />
          </Box>
        </Paper>

        {/* Шаг 2: Рабочие субботы */}
        {selectedMonth && saturdaysOfMonth.length > 0 ? (
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
              2. Укажите рабочие субботы
            </Typography>
            <Box sx={{ mt: 2, flexGrow: 1 }}>
              <SaturdaySelector
                saturdays={saturdaysOfMonth}
                workingSaturdays={workingSaturdays}
                selectedMonthNumber={selectedMonthNumber}
                onSaturdayToggle={handleSaturdayToggle}
                onCreateTemplate={() => {}}
                disabled={isLoadingPlans}
              />
            </Box>
          </Paper>
        ) : (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '150px',
            }}
          >
            <Typography color="text.secondary" textAlign="center">
              Сначала выберите месяц для отображения суббот
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Вторая строка: Шаги 3, 4 и 5 - только если выбран месяц */}
      {selectedMonth && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            alignItems: 'stretch',
          }}
        >
          {/* Шаг 3: Специальные дни */}
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
              3. Укажите специальные дни
            </Typography>
            <Box sx={{ mt: 2, flexGrow: 1 }}>
              <SpecialDaysSelector
                allDays={allDaysInMonth}
                specialDays={specialDays}
                selectedMonthNumber={selectedMonthNumber}
                onAddSpecialDay={handleSpecialDayAdd}
                onRemoveSpecialDay={handleSpecialDayRemove}
                disabled={isLoadingPlans}
              />
            </Box>
          </Paper>

          {/* Шаг 4: Анонсы мероприятий */}
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
              4. Добавьте анонсы мероприятий
            </Typography>
            <Box sx={{ mt: 2, flexGrow: 1 }}>
              <AnnouncementsSelector
                allDays={allDaysInMonth}
                announcements={announcements}
                onAddAnnouncement={handleAnnouncementAdd}
                onRemoveAnnouncement={handleAnnouncementRemove}
                disabled={isLoadingPlans}
              />
            </Box>
          </Paper>

          {/* Шаг 5: Создать план мероприятий */}
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
            elevation={3}
          >
            <Typography variant="h6" gutterBottom sx={planStylesForCreate}>
              5. Создать план мероприятий
            </Typography>
            <Box
              sx={{
                mt: 2,
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                paragraph
                sx={{ mb: 2 }}
              >
                После выбора рабочих суббот, специальных дней и анонсов нажмите
                кнопку для создания шаблона плана.
              </Typography>

              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Выбрано:</Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Рабочих суббот: {workingSaturdays.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Специальных дней: {specialDays.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Анонсов: {announcements.length}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    onClick={handleCreateTemplate}
                    disabled={isLoadingPlans}
                  >
                    Создать шаблон плана
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={handleResetAll}
                    color="error"
                    disabled={isLoadingPlans}
                  >
                    Сбросить все
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Отображение ошибок валидации */}
      <Collapse in={showErrors && validationErrors.length > 0}>
        <Box sx={{ mb: 3 }}>
          <ValidationErrors
            errors={validationErrors}
            onClose={() => setShowErrors(false)}
          />
        </Box>
      </Collapse>

      {days.length > 0 && (
        <>
          <PlanTable
            days={days}
            announcements={announcements} // Передаем анонсы
            monthNumber={selectedMonthNumber}
            year={selectedYear}
            error={apiError}
            isSuccess={isSuccess}
            onAddEvent={handleAddEvent}
            onUpdateEventTime={handleUpdateEventTime}
            onUpdateEventDescription={handleUpdateEventDescription}
            onUpdateEventResponsible={handleUpdateEventResponsible}
            onRemoveEvent={handleRemoveEvent}
            validationErrors={validationErrors}
            hasEmptyDays={hasEmptyDays}
          />

          <PlanActions
            onCancel={handleCancel}
            onSubmit={handleSubmit}
            isSubmitting={isCreating}
            isDisabled={days.length === 0 || hasEmptyDays || !isPlanComplete}
            hasValidationErrors={validationErrors.length > 0}
          />
        </>
      )}
    </Box>
  );
};

export default WorkPlanPanel;
