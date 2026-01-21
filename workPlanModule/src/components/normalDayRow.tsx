import React from 'react';
import { TableRow, TableCell, Typography, Box, Chip } from '@mui/material';
import { DayPlan } from 'src/types/plan.types';

interface NormalDayRowProps {
  day: DayPlan;
  isFirstEvent?: boolean;
}

const NormalDayRow: React.FC<NormalDayRowProps> = ({ day, isFirstEvent }) => {
  return (
    <>
      {day.events.map((event, index) => (
        <TableRow
          key={`${day.id}-${event.id}`}
          sx={{
            bgcolor: index === 0 ? 'grey.50' : 'transparent',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          {/* Дата - показываем только для первого мероприятия дня */}
          {isFirstEvent && index === 0 ? (
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
              <Typography variant="body2" color="text.secondary">
                {day.dayOfWeek}
              </Typography>
            </TableCell>
          ) : null}

          {/* Время */}
          <TableCell sx={{ verticalAlign: 'top' }}>
            <Typography variant="body2">{event.time || 'весь день'}</Typography>
          </TableCell>

          {/* Мероприятие */}
          <TableCell sx={{ verticalAlign: 'top' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
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
      ))}
    </>
  );
};

export default NormalDayRow;
