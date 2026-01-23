import React, { useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
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
  Button,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

import { Announcement, WorkPlan } from 'src/types/plan.types';
import PlanHeader from './planHeader';
import PlanTableHeader from './planTableHeader';
import WeekSeparator from './weekSeparator';
import WeekFilter from './weekFilter';

import { getMonthName, groupDaysByWeek } from '@utils/weekUtils';
import { DayWithAnnouncements } from './dayWithAnnouncements';

type WorkPlanViewProps = {
  plan?: WorkPlan;
  isLoading: boolean;
  error: string | null;
};

const WorkPlanView: React.FC<WorkPlanViewProps> = ({
  plan,
  isLoading,
  error,
}) => {
  // Состояния для фильтрации по неделям
  const [weekFilterType, setWeekFilterType] = React.useState<'all' | 'week'>(
    'week'
  );
  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const weeks = React.useMemo(() => {
    if (!plan?.days) return [];
    return groupDaysByWeek(plan.days, plan.year, plan.monthNumber);
  }, [plan]);
  // Определяем текущую неделю (по сегодняшней дате)
  const currentWeek = React.useMemo(() => {
    if (!plan) return null;

    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    // Проверяем, что сегодняшний день попадает в отображаемый месяц
    if (currentMonth === plan.monthNumber && currentYear === plan.year) {
      // Находим неделю, содержащую сегодняшний день
      const week = weeks.find((w) =>
        w.days.some((d) => d.dayNumber === currentDay)
      );
      return week?.weekNumber || null;
    }

    return null;
  }, [plan, weeks]);

  useEffect(() => {
    if (weeks.length > 0 && currentWeek && !selectedWeek) {
      setSelectedWeek(currentWeek);
      // УБРАТЬ: setWeekFilterType('week');
    } else if (weeks.length > 0 && !selectedWeek) {
      // Если текущей недели нет (план на другой месяц), показываем первую неделю
      setSelectedWeek(weeks[0].weekNumber);
    }
  }, [weeks, currentWeek, selectedWeek]);

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

  // Фильтруем недели в зависимости от выбранного фильтра
  const weeksToDisplay = React.useMemo(() => {
    if (weekFilterType === 'all') {
      return weeks;
    } else if (selectedWeek) {
      return weeks.filter((week) => week.weekNumber === selectedWeek);
    }
    return weeks;
  }, [weeks, weekFilterType, selectedWeek]);

  // Обработчик изменения типа фильтра
  const handleFilterTypeChange = (type: 'all' | 'week') => {
    setWeekFilterType(type);
    if (type === 'week' && !selectedWeek && weeks.length > 0) {
      // При первом переключении на "выбрать неделю" выбираем текущую неделю или первую
      setSelectedWeek(currentWeek || weeks[0].weekNumber);
    }
  };

  // Обработчик изменения выбранной недели
  const handleWeekChange = (weekNumber: number | null) => {
    setSelectedWeek(weekNumber);
  };

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

  const monthName = getMonthName(plan?.monthNumber);

  // Подготавливаем данные для WeekFilter
  const weekData = weeks.map((week) => ({
    weekNumber: week.weekNumber,
    startDate: week.startDate,
    endDate: week.endDate,
    monthName: monthName,
  }));

  return (
    <>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }} ref={contentRef}>
        {/* Заголовок плана */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PlanHeader monthName={plan.month} year={plan.year} />

          {/* Статистика */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 3,
              mt: 2,
              flexWrap: 'wrap',
            }}
          >
            <Chip
              label={`Всего дней: ${plan.days.length}`}
              color="primary"
              variant="outlined"
              sx={{ borderColor: '#2c3e50', color: '#2c3e50' }}
            />
            <Chip
              label={`Всего мероприятий: ${totalEvents}`}
              color="primary"
              variant="outlined"
              sx={{ borderColor: '#2c3e50', color: '#2c3e50' }}
            />
            {plan.announcements && plan.announcements.length > 0 && (
              <Chip
                label={`Анонсов: ${plan.announcements.length}`}
                color="primary"
                variant="outlined"
                sx={{ borderColor: '#2c3e50', color: '#2c3e50' }}
              />
            )}
            {plan.workingSaturdays && plan.workingSaturdays.length > 0 && (
              <Chip
                label={`Рабочих суббот: ${plan.workingSaturdays.length}`}
                color="primary"
                variant="outlined"
                sx={{ borderColor: '#2c3e50', color: '#2c3e50' }}
              />
            )}
            <Button onClick={reactToPrintFn} startIcon={<PrintIcon />} variant='outlined' size='small'>
              Печать
            </Button>
          </Box>
        </Box>

        {/* Фильтр по неделям */}
        <WeekFilter
          weeks={weekData}
          filterType={weekFilterType}
          selectedWeek={selectedWeek}
          onFilterTypeChange={handleFilterTypeChange}
          onWeekChange={handleWeekChange}
          currentWeek={currentWeek}
        />

        {/* Таблица с планом */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <PlanTableHeader />
              <TableBody>
                {weeksToDisplay.map((week) => (
                  <React.Fragment key={week.weekNumber}>
                    {/* Разделитель недели */}
                    <WeekSeparator
                      weekNumber={week.weekNumber}
                      startDate={week.startDate}
                      endDate={week.endDate}
                      monthName={monthName}
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
                {weeksToDisplay.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="text.secondary">
                        {weekFilterType === 'week' && selectedWeek
                          ? `На неделе ${selectedWeek} нет мероприятий`
                          : 'Нет мероприятий на этот месяц'}
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
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: '#f8f9fa',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
            }}
          >
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600, color: '#2c3e50' }}
            >
              Рабочие субботы:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {plan.workingSaturdays.map((dayNumber, index) => (
                <Chip
                  key={index}
                  label={`${dayNumber} (суббота)`}
                  sx={{
                    bgcolor: '#e8f4fd',
                    color: '#1976d2',
                    border: '1px solid #90caf9',
                  }}
                  size="small"
                />
              ))}
            </Box>
          </Paper>
        )}

        {/* Информация о выбранном фильтре */}
        {weekFilterType === 'week' && selectedWeek && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Показана неделя {selectedWeek} из {weeks.length}
              {currentWeek === selectedWeek && ' (текущая неделя)'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Для просмотра всех недель переключите фильтр на Все недели
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
};

export default WorkPlanView;
