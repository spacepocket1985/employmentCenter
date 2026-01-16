
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
} from '@mui/material';
import { LocalDayPlan } from 'src/types/workPlan.types';

import PlanHeader from './planHeader';
import DayRow from './dayRow';
import { getErrorMessage } from '@utils/errorUtils';

interface PlanTableProps {
  days: LocalDayPlan[];
  monthNumber: number;
  year: number;
  error?: unknown;
  isSuccess?: boolean;
  onAddEvent: (dayId: string) => void;
  onUpdateEventTime: (dayId: string, eventId: string, time: string) => void;
  onUpdateEventDescription: (dayId: string, eventId: string, description: string) => void;
  onUpdateEventResponsible: (dayId: string, eventId: string, responsiblePersons: string[]) => void;
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
                  fontSize: '0.875rem',
                }}
              >
                Дата
              </TableCell>
              <TableCell
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  width: '10%',
                  fontSize: '0.875rem',
                }}
              >
                Время
              </TableCell>
              <TableCell
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  width: '55%',
                  fontSize: '0.875rem',
                }}
              >
                Мероприятия
              </TableCell>
              <TableCell
                sx={{ 
                  color: 'white', 
                  fontWeight: 'bold', 
                  width: '25%',
                  fontSize: '0.875rem',
                }}
              >
                Ответственный за выполнение
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((day) => (
              <DayRow
                key={day.id}
                day={day}
                onAddEvent={onAddEvent}
                onUpdateEventTime={onUpdateEventTime}
                onUpdateEventDescription={onUpdateEventDescription}
                onUpdateEventResponsible={onUpdateEventResponsible}
                onRemoveEvent={onRemoveEvent}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlanTable;