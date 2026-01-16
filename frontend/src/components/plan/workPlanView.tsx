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
} from '@mui/material';

import { MONTHS } from '@utils/dateUtils';
import { getErrorMessage } from '@utils/errorUtils';
import { useGetWorkPlanByIdQuery } from '@store/slices/workPlanApiSlice';

interface WorkPlanViewProps {
  planId: string;
}

const WorkPlanView: React.FC<WorkPlanViewProps> = ({ planId }) => {
  const { data, isLoading, error } = useGetWorkPlanByIdQuery(planId);

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
  const monthName = MONTHS[plan.monthNumber - 1];

  // Подсчитываем общее количество мероприятий
  const totalEvents = plan.days.reduce(
    (total, day) => total + day.events.length,
    0
  );

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
          П Л А Н
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
            label={`Всего мероприятий: ${totalEvents}`}
            color="secondary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Таблица с планом */}
      <Paper elevation={2}>
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
                // Дни без мероприятий (например, праздники)
                if (day.isSpecialDay && day.events.length === 0) {
                  return (
                    <TableRow key={day.id} sx={{ bgcolor: 'grey.50' }}>
                      <TableCell colSpan={4}>
                        <Box sx={{ textAlign: 'center', py: 2 }}>
                          <Typography variant="h6" color="primary">
                            {day.dayNumber} -{' '}
                            {day.specialDayTitle || 'Особый день'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {day.dayOfWeek}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                }

                // Дни с мероприятиями
                return day.events.map((event, index) => (
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
                          verticalAlign: '',
                          borderRight: 1,
                          borderColor: 'divider',
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
                    </TableCell>
                  </TableRow>
                ));
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
