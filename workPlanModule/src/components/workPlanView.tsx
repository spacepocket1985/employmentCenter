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
import PrintApproval from './printApproval';

import { getMonthName, groupDaysByWeek } from '@utils/weekUtils';
import { DayWithAnnouncements } from './dayWithAnnouncements';
import { PRINT_GLOBAL_STYLES } from 'src/const/printStyles';
import { NoteForPlan } from './noteForPlan';

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
  const [weekFilterType, setWeekFilterType] = React.useState<'all' | 'week'>(
    'week'
  );
  const [selectedWeek, setSelectedWeek] = React.useState<number | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: PRINT_GLOBAL_STYLES,
    documentTitle: `План мероприятий на ${plan?.month} ${plan?.year}`,
  });

  const weeks = React.useMemo(() => {
    if (!plan?.days) return [];
    return groupDaysByWeek(plan.days, plan.year, plan.monthNumber);
  }, [plan]);

  const currentWeek = React.useMemo(() => {
    if (!plan) return null;
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    if (currentMonth === plan.monthNumber && currentYear === plan.year) {
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
    } else if (weeks.length > 0 && !selectedWeek) {
      setSelectedWeek(weeks[0].weekNumber);
    }
  }, [weeks, currentWeek, selectedWeek]);

  const announcementsByDay = React.useMemo(() => {
    if (!plan || !plan.announcements) return {};
    const groups: Record<number, Announcement[]> = {};
    plan.announcements.forEach((announcement) => {
      if (!groups[announcement.dayNumber]) {
        groups[announcement.dayNumber] = [];
      }
      groups[announcement.dayNumber].push(announcement);
    });

    Object.keys(groups).forEach((dayNumber) => {
      groups[Number(dayNumber)].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return groups;
  }, [plan]);

  const weeksToDisplay = React.useMemo(() => {
    if (weekFilterType === 'all') {
      return weeks;
    } else if (selectedWeek) {
      return weeks.filter((week) => week.weekNumber === selectedWeek);
    }
    return weeks;
  }, [weeks, weekFilterType, selectedWeek]);

  const handleFilterTypeChange = (type: 'all' | 'week') => {
    setWeekFilterType(type);
    if (type === 'week' && !selectedWeek && weeks.length > 0) {
      setSelectedWeek(currentWeek || weeks[0].weekNumber);
    }
  };

  const handleWeekChange = (weekNumber: number | null) => {
    setSelectedWeek(weekNumber);
  };

  const totalEvents = React.useMemo(() => {
    if (!plan?.days) return 0;
    return plan.days.reduce((total, day) => total + day.events.length, 0);
  }, [plan?.days]);

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

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!plan) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        План не найден
      </Alert>
    );
  }

  const monthName = getMonthName(plan?.monthNumber);
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

          {/* Статистика - скрываем при печати */}
          <Box
            className="no-print"
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
            <Button
              onClick={reactToPrintFn}
              startIcon={<PrintIcon />}
              variant="outlined"
              size="small"
            >
              Печать
            </Button>
          </Box>
        </Box>

        {/* Фильтр по неделям - скрываем при печати */}
        <Box className="no-print">
          <WeekFilter
            weeks={weekData}
            filterType={weekFilterType}
            selectedWeek={selectedWeek}
            onFilterTypeChange={handleFilterTypeChange}
            onWeekChange={handleWeekChange}
            currentWeek={currentWeek}
          />
        </Box>

        {/* Таблица с планом */}
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            '@media print': {
              border: '1px solid #000 !important',
              borderRadius: '0 !important',
            },
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 650 }} size="small">
              <PlanTableHeader />
              <TableBody>
                {weeksToDisplay.map((week) => (
                  <React.Fragment key={week.weekNumber}>
                    <WeekSeparator
                      weekNumber={week.weekNumber}
                      startDate={week.startDate}
                      endDate={week.endDate}
                      monthName={monthName}
                    />
                    {week.days.map((day) => (
                      <DayWithAnnouncements
                        key={day.id}
                        day={day}
                        announcements={announcementsByDay[day.dayNumber] || []}
                      />
                    ))}
                  </React.Fragment>
                ))}
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

        {/* Информация о рабочих субботах - скрываем при печати */}
        <Box className="no-print">
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
        </Box>

        <NoteForPlan />

        {/* Информация о выбранном фильтре - скрываем при печати */}
        <Box className="no-print">
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

        {/* Блок утверждения - показываем только при печати */}
        <PrintApproval mounth={monthName} />
      </Box>
    </>
  );
};

export default WorkPlanView;
