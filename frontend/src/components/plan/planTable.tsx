import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { LocalDayPlan } from 'src/types/workPlan.types';

import PlanHeader from './planHeader';
import DayRow from './dayRow1';
import { getErrorMessage } from '@utils/errorUtils';

interface PlanTableProps {
  days: LocalDayPlan[];
  monthNumber: number;
  year: number;
  error?: unknown;
  isSuccess?: boolean;
  onAddEvent: (dayId: string) => void;
  onUpdateEventTime: (dayId: string, eventId: string, time: string) => void;
  onUpdateEventDescription: (
    dayId: string,
    eventId: string,
    description: string
  ) => void;
  onUpdateEventResponsible: (
    dayId: string,
    eventId: string,
    responsiblePersons: string[]
  ) => void;
  onRemoveEvent: (dayId: string, eventId: string) => void;
}

const PlanTable: React.FC<PlanTableProps> = ({
  days,
  monthNumber,
  year,
  error,
  isSuccess,
  onAddEvent,
  onUpdateEventTime,
  onUpdateEventDescription,
  onUpdateEventResponsible,
  onRemoveEvent,
}) => {
  const errorMessage = getErrorMessage(error);

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <PlanHeader monthNumber={monthNumber} year={year} />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          План успешно создан!
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead sx={{ bgcolor: 'primary.main' }}>
            <TableRow>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  width: '10%',
                  fontSize: '1rem',
                }}
                align="center"
              >
                Дата
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  width: '10%',
                  fontSize: '1rem',
                }}
                align="center"
              >
                Время
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  width: '55%',
                  fontSize: '1rem',
                }}
                align="center"
              >
                Мероприятия
              </TableCell>
              <TableCell
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  width: '25%',
                  fontSize: '1rem',
                }}
                align="center"
              >
                Ответственный за выполнение
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => {
              // Для специальных дней отображаем особую строку
              if (day.isSpecialDay && day.specialDayTitle) {
                return (
                  <React.Fragment key={day.id}>
                    {/* Специальный день - отдельная строка без столбцов */}
                    <TableRow sx={{ bgcolor: 'warning.light' }}>
                      <TableCell
                        colSpan={4}
                        sx={{ py: 3, textAlign: 'center' }}
                      >
                        <Typography
                          variant="h6"
                          color="text.primary"
                          fontWeight="bold"
                          sx={{ textTransform: 'uppercase' }}
                        >
                          {day.specialDayTitle}
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {/* Затем идут обычные мероприятия этого дня, если они есть */}
                    {day.events.slice(1).map((event) => (
                      <TableRow
                        key={event.id}
                        sx={{ '& td': { verticalAlign: 'top' } }}
                      >
                        {/* Для остальных мероприятий в специальный день показываем дату */}
                        <TableCell sx={{ width: '10%' }}>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {day.dayNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {day.dayOfWeek}
                            </Typography>
                          </Box>
                        </TableCell>
                        {/* Остальные ячейки с данными события */}
                        <TableCell sx={{ width: '10%' }}>
                          {/* Время */}
                        </TableCell>
                        <TableCell sx={{ width: '55%' }}>
                          {/* Описание */}
                        </TableCell>
                        <TableCell sx={{ width: '25%' }}>
                          {/* Ответственные */}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              }

              // Обычный день
              return (
                <DayRow
                  key={day.id}
                  day={day}
                  onAddEvent={onAddEvent}
                  onUpdateEventTime={onUpdateEventTime}
                  onUpdateEventDescription={onUpdateEventDescription}
                  onUpdateEventResponsible={onUpdateEventResponsible}
                  onRemoveEvent={onRemoveEvent}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlanTable;
