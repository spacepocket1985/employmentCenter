import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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

import { MONTHS } from '@utils/dateUtils';
import { getErrorMessage } from '@utils/errorUtils';
import { useGetWorkPlanByIdQuery } from '@store/slices/workPlanApiSlice';
import { WorkPlan, Announcement } from 'src/types/workPlan.types';

interface AnnouncementDisplayProps {
  announcement: Announcement;
  dayOfWeek: string;
  mode?: 'view' | 'edit';
  onEditAnnouncement?: (announcement: Announcement) => void;
  onDeleteAnnouncement?: (id: string) => void;
}

interface WorkPlanViewProps {
  planId: string;
  mode?: 'view' | 'edit';
  planData?: WorkPlan; // Позволяет передать данные напрямую (для режима редактирования)
  onEditDay?: (dayId: string) => void;
  onEditEvent?: (dayId: string, eventId: string) => void;
  onEditAnnouncement?: (announcement: Announcement) => void;
}

const AnnouncementDisplay: React.FC<AnnouncementDisplayProps> = ({
  announcement,
  dayOfWeek,
  mode = 'view',
  onEditAnnouncement,
  onDeleteAnnouncement,
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

  const handleClick = () => {
    if (mode === 'edit' && onEditAnnouncement) {
      onEditAnnouncement(announcement);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode === 'edit' && onDeleteAnnouncement) {
      onDeleteAnnouncement(announcement.id);
    }
  };

  return (
    <TableRow 
      sx={{ 
        bgcolor: styleConfig.bgcolor,
        cursor: mode === 'edit' ? 'pointer' : 'default',
        '&:hover': mode === 'edit' ? { 
          bgcolor: 'action.hover',
          boxShadow: 1 
        } : {},
      }}
      onClick={handleClick}
    >
      <TableCell colSpan={4}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 2,
          py: 1,
          px: 2,
          position: 'relative',
        }}>
          <Icon sx={{ color: styleConfig.color }}>
            {styleConfig.icon}
          </Icon>
          <Box sx={{ flex: 1 }}>
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
          
          {mode === 'edit' && (
            <Chip
              label="Удалить"
              size="small"
              color="error"
              onClick={handleDelete}
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
};

const WorkPlanView: React.FC<WorkPlanViewProps> = ({ 
  planId, 
  mode = 'view',
  planData,
  onEditDay,
  onEditEvent,
  onEditAnnouncement,
}) => {
  // Используем запрос только если не переданы данные напрямую
  const { data, isLoading, error } = useGetWorkPlanByIdQuery(planId, {
    skip: !!planData, // Пропускаем запрос если есть planData
  });

  // Группируем анонсы по дням - ВЫЗЫВАЕМ ДО ЛЮБЫХ УСЛОВНЫХ ВОЗВРАТОВ
  const announcementsByDay = React.useMemo(() => {
    const plan = planData || data?.data;
    if (!plan || !plan.announcements) return {};
    
    const groups: Record<number, Announcement[]> = {};
    plan.announcements.forEach(announcement => {
      if (!groups[announcement.dayNumber]) {
        groups[announcement.dayNumber] = [];
      }
      groups[announcement.dayNumber].push(announcement);
    });
    
    // Сортируем анонсы внутри дня по order
    Object.keys(groups).forEach(dayNumber => {
      groups[Number(dayNumber)].sort((a, b) => (a.order || 0) - (b.order || 0));
    });
    
    return groups;
  }, [planData, data?.data]);

  // Определяем активный план
  const activePlan = planData || data?.data;

  // Условный рендеринг ПОСЛЕ всех хуков
  if (isLoading && !planData) {
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

  if (error && !planData) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {getErrorMessage(error)}
      </Alert>
    );
  }

  if (!activePlan) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        План не найден
      </Alert>
    );
  }

  const plan = activePlan;
  const monthName = MONTHS[plan.monthNumber - 1];

  const handleDayClick = (dayId: string) => {
    if (mode === 'edit' && onEditDay) {
      onEditDay(dayId);
    }
  };

  const handleEventClick = (dayId: string, eventId: string) => {
    if (mode === 'edit' && onEditEvent) {
      onEditEvent(dayId, eventId);
    }
  };

  const handleAnnouncementDelete = (id: string) => {
    // В реальном приложении здесь будет логика удаления
    console.log('Delete announcement:', id);
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', p: 3 }}>
      {/* Заголовок плана */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            mb: 1,
          }}
        >
          {mode === 'edit' ? 'РЕДАКТИРОВАНИЕ ПЛАНА' : 'П Л А Н'}
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          мероприятий по Гродненской ТЭЦ-2
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          на {monthName} {plan.year} года
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 2 }}>
          <Chip
            label={`Всего дней: ${plan.days.length}`}
            color="primary"
            variant="outlined"
          />
          <Chip
            label={`Всего мероприятий: ${plan.days.reduce((total, day) => total + day.events.length, 0)}`}
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
          {mode === 'edit' && (
            <Chip
              label="Режим редактирования"
              color="warning"
              variant="filled"
            />
          )}
        </Box>
      </Box>

      {/* Таблица с планом */}
      <Paper elevation={mode === 'edit' ? 3 : 2}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold', width: '10%' }}
                >
                  Дата
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold', width: '10%' }}
                >
                  Время
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold', width: '55%' }}
                >
                  Мероприятия
                </TableCell>
                <TableCell
                  sx={{ color: 'white', fontWeight: 'bold', width: '25%' }}
                >
                  Ответственный за выполнение
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plan.days.map((day) => {
                // Получаем анонсы для этого дня
                const dayAnnouncements = announcementsByDay[day.dayNumber] || [];
                
                return (
                  <React.Fragment key={day.id}>
                    {/* Отображаем анонсы */}
                    {dayAnnouncements.map((announcement) => (
                      <AnnouncementDisplay
                        key={announcement.id}
                        announcement={announcement}
                        dayOfWeek={day.dayOfWeek}
                        mode={mode}
                        onEditAnnouncement={onEditAnnouncement}
                        onDeleteAnnouncement={handleAnnouncementDelete}
                      />
                    ))}
                    
                    {/* Отображаем день */}
                    {day.isSpecialDay && day.events.length === 0 ? (
                      // Специальный день без мероприятий
                      <TableRow 
                        sx={{ 
                          bgcolor: 'grey.50',
                          cursor: mode === 'edit' ? 'pointer' : 'default',
                          '&:hover': mode === 'edit' ? { 
                            bgcolor: 'action.hover',
                            boxShadow: 1 
                          } : {},
                        }}
                        onClick={() => handleDayClick(day.id)}
                      >
                        <TableCell colSpan={4}>
                          <Box sx={{ textAlign: 'center', py: 2 }}>
                            <Typography variant="h6" color="primary">
                              {day.dayNumber} -{' '}
                              {day.specialDayTitle || 'Особый день'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {day.dayOfWeek}
                            </Typography>
                            {mode === 'edit' && (
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: 'block', 
                                  mt: 1,
                                  fontStyle: 'italic',
                                }}
                              >
                                Нажмите для редактирования
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      // День с мероприятиями
                      day.events.map((event, index) => (
                        <TableRow
                          key={`${day.id}-${event.id}`}
                          sx={{
                            bgcolor: index === 0 ? 'grey.50' : 'transparent',
                            '&:hover': { 
                              bgcolor: 'action.hover',
                              cursor: mode === 'edit' ? 'pointer' : 'default',
                            },
                          }}
                          onClick={() => handleEventClick(day.id, event.id)}
                        >
                          {/* Дата - показываем только для первого мероприятия дня */}
                          {index === 0 ? (
                            <TableCell
                              rowSpan={day.events.length}
                              sx={{
                                verticalAlign: 'top',
                                borderRight: 1,
                                borderColor: 'divider',
                                position: 'relative',
                              }}
                            >
                              <Typography variant="body1" fontWeight="bold">
                                {day.dayNumber}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {day.dayOfWeek}
                              </Typography>
                              {day.isSpecialDay && day.specialDayTitle && (
                                <Typography
                                  variant="caption"
                                  color="primary"
                                  display="block"
                                  mt={0.5}
                                >
                                  {day.specialDayTitle}
                                </Typography>
                              )}
                              {mode === 'edit' && (
                                <Chip
                                  label="Редактировать"
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{
                                    position: 'absolute',
                                    bottom: 8,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                  }}
                                />
                              )}
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
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
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
                            {mode === 'edit' && (
                              <Typography 
                                variant="caption" 
                                color="text.secondary"
                                sx={{ 
                                  display: 'block', 
                                  mt: 1,
                                  fontStyle: 'italic',
                                }}
                              >
                                Нажмите для редактирования
                              </Typography>
                            )}
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
                    {mode === 'edit' && (
                      <Typography 
                        variant="body2" 
                        color="primary"
                        sx={{ mt: 2 }}
                      >
                        Добавьте дни и мероприятия
                      </Typography>
                    )}
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