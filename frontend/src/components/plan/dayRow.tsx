// components/DayRow/DayRow.tsx
import React from 'react';
import { TableRow, TableCell, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LocalDayPlan } from 'src/types/workPlan.types';
import EventRow from './eventRow';

interface DayRowProps {
  day: LocalDayPlan;
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

const DayRow: React.FC<DayRowProps> = ({
  day,
  onAddEvent,
  onUpdateEventTime,
  onUpdateEventDescription,
  onUpdateEventResponsible,
  onRemoveEvent,
}) => {
  return (
    <React.Fragment key={day.id}>
      {/* Основная строка с датой */}
      <TableRow sx={{ bgcolor: 'grey.50' }}>
        <TableCell
          rowSpan={day.events.length > 0 ? day.events.length + 1 : 1}
          sx={{ width: '10%', backgroundColor: 'primary.main' }}
          align="center"
          color="white"
        >
          <Typography variant="h4" fontWeight="bold" color="white">
            {day.dayNumber}
          </Typography>
          <Typography variant="body2" color="white" fontSize="0.9rem">
            {day.dayOfWeek}
          </Typography>
        </TableCell>

        {day.events.length === 0 && (
          <>
            <TableCell colSpan={3} sx={{ width: '90%' }}>
              <Button
                startIcon={<AddIcon />}
                onClick={() => onAddEvent(day.id)}
                color='inherit'
                sx={{ fontSize: '0.75rem' }}
                variant="contained"
              >
                Добавить мероприятие
              </Button>
            </TableCell>
          </>
        )}
      </TableRow>

      {/* Строки с мероприятиями */}
      {day.events.map((event) => (
        <TableRow key={event.id} sx={{ '& td': { verticalAlign: 'top' } }}>
          <EventRow
            event={event}
            dayId={day.id}
            onUpdateTime={onUpdateEventTime}
            onUpdateDescription={onUpdateEventDescription}
            onUpdateResponsible={onUpdateEventResponsible}
            onRemoveEvent={onRemoveEvent}
          />
        </TableRow>
      ))}

      {/* Кнопка добавления мероприятия если уже есть события */}
      {day.events.length > 0 && (
        <TableRow>
          <TableCell
            colSpan={4}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              width: '100%',
            }}
          >
            <Button
              startIcon={<AddIcon />}
              onClick={() => onAddEvent(day.id)}
              color="primary"
              sx={{ fontSize: '0.75rem' }}
              variant="contained"
            >
              Добавить еще одно мероприятие
            </Button>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};

export default DayRow;
