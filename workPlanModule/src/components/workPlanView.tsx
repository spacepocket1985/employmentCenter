// WorkPlanView.tsx (обновленная версия)
import React from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { usePlanDisplay } from '@hooks/usePlanDisplay';
import { DayPlan, Announcement } from 'src/types/plan.types';
import PlanHeader from './planHeader';
import PlanTableHeader from './planTableHeader';
import WeekSeparator from './weekSeparator';
import AnnouncementDisplay from './announcementDisplay';
import SpecialDayRow from './specialDayRow';
import NormalDayRow from './normalDayRow';

// Вспомогательная функция для получения номера недели месяца
const getWeekNumber = (dayNumber: number, firstDayOfMonth: number): number => {
  return Math.floor((dayNumber + firstDayOfMonth - 1) / 7);
};

// Функция для группировки дней по неделям
const groupDaysByWeek = (
  days: DayPlan[],
  year: number,
  monthNumber: number
): Array<{
  weekNumber: number;
  days: DayPlan[];
  startDate: string;
  endDate: string;
}> => {
  // Получаем первый день месяца (0 - воскресенье, 1 - понедельник и т.д.)
  const firstDayOfMonth = new Date(year, monthNumber - 1, 1).getDay();
  // Преобразуем к формату, где понедельник = 0
  const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const weeksMap = new Map<number, DayPlan[]>();

  // Группируем дни по неделям
  days.forEach((day) => {
    const weekNum = getWeekNumber(day.dayNumber, firstDayAdjusted);
    if (!weeksMap.has(weekNum)) {
      weeksMap.set(weekNum, []);
    }
    weeksMap.get(weekNum)!.push(day);
  });

  // Сортируем по номеру недели и создаем результат
  return Array.from(weeksMap.entries())
    .sort(([weekA], [weekB]) => weekA - weekB)
    .map(([weekNumber, weekDays]) => {
      // Сортируем дни внутри недели по номеру дня
      const sortedDays = weekDays.sort((a, b) => a.dayNumber - b.dayNumber);
      
      // Определяем даты начала и конца недели
      const startDay = sortedDays[0].dayNumber;
      const endDay = sortedDays[sortedDays.length - 1].dayNumber;
      
      return {
        weekNumber: weekNumber + 1, // Нумерация недель с 1
        days: sortedDays,
        startDate: `${startDay} ${sortedDays[0].dayOfWeek}`,
        endDate: `${endDay} ${sortedDays[sortedDays.length - 1].dayOfWeek}`,
      };
    });
};

// Компонент для отображения дня с анонсами
interface DayWithAnnouncementsProps {
  day: DayPlan;
  announcements: Announcement[];
}

const DayWithAnnouncements: React.FC<DayWithAnnouncementsProps> = ({
  day,
  announcements,
}) => {
  return (
    <React.Fragment key={day.id}>
      {/* Отображаем анонсы для этого дня */}
      {announcements.map((announcement) => (
        <AnnouncementDisplay
          key={announcement.id}
          announcement={announcement}
          dayOfWeek={day.dayOfWeek}
        />
      ))}

      {/* Отображаем день */}
      {day.isSpecialDay ? (
        <SpecialDayRow day={day} />
      ) : (
        <NormalDayRow day={day} isFirstEvent={true} />
      )}
    </React.Fragment>
  );
};

// Основной компонент отображения плана
const WorkPlanView: React.FC = () => {
  const { plan, isLoading, error } = usePlanDisplay();

  // Группируем анонсы по дням
  const announcementsByDay = React.useMemo(() => {
    if (!plan || !plan.announcements) return {};

    const groups: Record<number, Announcement[]> = {};
    plan.announcements.forEach((announcement) => {
      if (!groups[announcement.dayNumber]) {
        groups[announcement.dayNumber] = [];
      }
      groups[announcement.dayNumber].push(announcement);
    });

    // Сортируем анонсы внутри дня по order
    Object.keys(groups).forEach((dayNumber) => {
      groups[Number(dayNumber)].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return groups;
  }, [plan]);

  // Группируем дни по неделям
  const weeks = React.useMemo(() => {
    if (!plan?.days) return [];
    return groupDaysByWeek(plan.days, plan.year, plan.monthNumber);
  }, [plan]);

  // Считаем общее количество мероприятий
  const totalEvents = React.useMemo(() => {
    if (!plan?.days) return 0;
    return plan.days.reduce((total, day) => total + day.events.length, 0);
  }, [plan?.days]);

  // Состояние загрузки
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Ошибка
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  // План не найден
  if (!plan) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        План не найден
      </Alert>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Заголовок плана */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <PlanHeader monthNumber={plan.monthNumber} year={plan.year} />

        {/* Статистика */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2, flexWrap: 'wrap' }}>
          <Chip
            label={`Всего дней: ${plan.days.length}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Всего мероприятий: ${totalEvents}`}
            color="secondary"
            variant="outlined"
          />
          {plan.announcements && plan.announcements.length > 0 && (
            <Chip
              label={`Анонсов: ${plan.announcements.length}`}
              color="info"
              variant="outlined"
            />
          )}
          {plan.workingSaturdays && plan.workingSaturdays.length > 0 && (
            <Chip
              label={`Рабочих суббот: ${plan.workingSaturdays.length}`}
              color="warning"
              variant="outlined"
            />
          )}
          {weeks.length > 0 && (
            <Chip
              label={`Всего недель: ${weeks.length}`}
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </Box>

      {/* Таблица с планом */}
      <Paper elevation={2} sx={{ mb: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <PlanTableHeader />
            <TableBody>
              {weeks.map((week) => (
                <React.Fragment key={week.weekNumber}>
                  {/* Разделитель недели */}
                  <WeekSeparator
                    weekNumber={week.weekNumber}
                    startDate={week.startDate}
                    endDate={week.endDate}
                  />

                  {/* Дни недели */}
                  {week.days.map((day) => (
                    <DayWithAnnouncements
                      key={day.id}
                      day={day}
                      announcements={announcementsByDay[day.dayNumber] || []}
                    />
                  ))}
                </React.Fragment>
              ))}

              {/* Если дней нет */}
              {weeks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Нет мероприятий на этот месяц
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Информация о рабочих субботах */}
      {plan.workingSaturdays && plan.workingSaturdays.length > 0 && (
        <Paper elevation={1} sx={{ p: 2, bgcolor: 'warning.50' }}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
            Рабочие субботы:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {plan.workingSaturdays.map((dayNumber, index) => (
              <Chip
                key={index}
                label={`${dayNumber} (суббота)`}
                color="warning"
                variant="filled"
                size="small"
              />
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default WorkPlanView;