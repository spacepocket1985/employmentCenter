import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Icon,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AnnouncementIcon from '@mui/icons-material/Announcement';

import { getErrorMessage } from '@utils/errorUtils';
import { useGetWorkPlanByIdQuery } from '@store/slices/workPlanApiSlice';
import { Announcement } from 'src/types/workPlan.types';
import PlanHeader from './planHeader';
import { TableHeader } from './table';

interface AnnouncementDisplayProps {
  announcement: Announcement;
  dayOfWeek: string;
}

interface WorkPlanViewProps {
  planId: string;
}

const AnnouncementDisplay: React.FC<AnnouncementDisplayProps> = ({
  announcement,
  dayOfWeek,
}) => {
  const getStyleConfig = () => {
    switch (announcement.style) {
      case 'warning':
        return {
          bgcolor: 'warning.light',
          color: 'warning.contrastText',
          icon: <WarningIcon />,
        };
      case 'success':
        return {
          bgcolor: 'success.light',
          color: 'success.contrastText',
          icon: <CheckCircleIcon />,
        };
      case 'primary':
        return {
          bgcolor: 'primary.light',
          color: 'primary.contrastText',
          icon: <AnnouncementIcon />,
        };
      case 'info':
      default:
        return {
          bgcolor: 'info.light',
          color: 'info.contrastText',
          icon: <InfoIcon />,
        };
    }
  };

  const styleConfig = getStyleConfig();

  return (
    <TableRow
      sx={{
        bgcolor: styleConfig.bgcolor,
      }}
    >
      <TableCell colSpan={4}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            py: 1,
            px: 2,
          }}
        >
          <Icon sx={{ color: styleConfig.color }}>{styleConfig.icon}</Icon>
          <Box>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: styleConfig.color,
                textTransform: 'uppercase',
              }}
            >
              {announcement.title}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: styleConfig.color,
                opacity: 0.9,
                display: 'block',
                mt: 0.5,
              }}
            >
              Анонс для {announcement.dayNumber} {dayOfWeek}
            </Typography>
          </Box>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const WorkPlanView: React.FC<WorkPlanViewProps> = ({ planId }) => {
  const { data, isLoading, error } = useGetWorkPlanByIdQuery(planId);

  // Группируем анонсы по дням - ВЫЗЫВАЕМ ДО ЛЮБЫХ УСЛОВНЫХ ВОЗВРАТОВ
  const announcementsByDay = React.useMemo(() => {
    const plan = data?.data;
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
  }, [data?.data]);

  // Условный рендеринг ПОСЛЕ всех хуков
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
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (!data?.data) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        План не найден
      </Alert>
    );
  }

  const plan = data.data;

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Заголовок плана */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <PlanHeader monthNumber={plan.monthNumber} year={plan.year} />

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Chip
            label={`Всего дней: ${plan.days.length}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Всего мероприятий: ${plan.days.reduce(
              (total, day) => total + day.events.length,
              0
            )}`}
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
        </Box>
      </Box>

      {/* Таблица с планом */}
      <Paper elevation={2}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHeader />
            <TableBody>
              {plan.days.map((day) => {
                // Получаем анонсы для этого дня
                const dayAnnouncements =
                  announcementsByDay[day.dayNumber] || [];

                return (
                  <React.Fragment key={day.id}>
                    {/* Отображаем анонсы */}
                    {dayAnnouncements.map((announcement) => (
                      <AnnouncementDisplay
                        key={announcement.id}
                        announcement={announcement}
                        dayOfWeek={day.dayOfWeek}
                      />
                    ))}

                    {/* Отображаем день */}
                    {day.isSpecialDay ? (
                      // СПЕЦИАЛЬНЫЙ ДЕНЬ - объединяем все колонки кроме даты
                      <TableRow sx={{ bgcolor: 'warning.light' }}>
                        {/* Ячейка даты */}
                        <TableCell
                          sx={{
                            verticalAlign: 'top',
                            borderRight: 1,
                            borderColor: 'divider',
                            bgcolor: 'warning.main',
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            color="white"
                          >
                            {day.dayNumber}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="white"
                            fontSize="0.9rem"
                          >
                            {day.dayOfWeek}
                          </Typography>
                        </TableCell>

                        {/* Объединенные колонки для названия специального дня */}
                        <TableCell
                          colSpan={3}
                          sx={{
                            verticalAlign: 'middle',
                            textAlign: 'center',
                            py: 2,
                          }}
                        >
                          <Typography
                            variant="body1"
                            color="primary"
                            fontWeight="bold"
                            sx={{
                              textTransform: 'uppercase',
                              fontSize: '1.1rem',
                            }}
                          >
                            {day.specialDayTitle || 'Специальный день'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // ОБЫЧНЫЙ ДЕНЬ с мероприятиями
                      day.events.map((event, index) => (
                        <TableRow
                          key={`${day.id}-${event.id}`}
                          sx={{
                            bgcolor: index === 0 ? 'grey.50' : 'transparent',
                            '&:hover': { bgcolor: 'action.hover' },
                          }}
                        >
                          {/* Дата - показываем только для первого мероприятия дня */}
                          {index === 0 ? (
                            <TableCell
                              rowSpan={day.events.length}
                              sx={{
                                verticalAlign: 'top',
                                borderRight: 1,
                                borderColor: 'divider',
                              }}
                            >
                              <Typography variant="body1" fontWeight="bold">
                                {day.dayNumber}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {day.dayOfWeek}
                              </Typography>
                            </TableCell>
                          ) : null}

                          {/* Время */}
                          <TableCell sx={{ verticalAlign: 'top' }}>
                            <Typography variant="body2">
                              {event.time || 'весь день'}
                            </Typography>
                          </TableCell>

                          {/* Мероприятие */}
                          <TableCell sx={{ verticalAlign: 'top' }}>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: 'pre-wrap' }}
                            >
                              {event.description}
                            </Typography>
                            {event.notes && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  display: 'block',
                                  mt: 1,
                                  fontStyle: 'italic',
                                }}
                              >
                                Примечание: {event.notes}
                              </Typography>
                            )}
                          </TableCell>

                          {/* Ответственные */}
                          <TableCell sx={{ verticalAlign: 'top' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 0.5,
                              }}
                            >
                              {event.responsiblePersons.map((person, idx) => (
                                <Chip
                                  key={idx}
                                  label={person}
                                  size="small"
                                  variant="outlined"
                                  sx={{ mb: 0.5 }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </React.Fragment>
                );
              })}

              {/* Если дней нет */}
              {plan.days.length === 0 && (
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
    </Box>
  );
};

export default WorkPlanView;
