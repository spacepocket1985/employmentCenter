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
                verticalAlign: 'center',
                borderRight: 1,
                borderColor: 'divider',
                backgroundColor: '#103896',
                borderBottom: '1px white solid',
              }}
              align="center"
            >
              <Typography
                variant="body1"
                fontWeight="bold"
                color="white"
                fontSize={'2rem'}
              >
                {day.dayNumber}
              </Typography>
              <Typography variant="body1" color="white" fontSize={'1rem'}>
                {day.dayOfWeek}
              </Typography>
            </TableCell>
          ) : null}

          {/* Время */}
          <TableCell sx={{ verticalAlign: 'center' }}>
            <Typography variant="body1" fontSize={'1rem'} align="center">
              {event.time || 'весь день'}
            </Typography>
          </TableCell>

          {/* Мероприятие */}
          <TableCell sx={{ verticalAlign: 'center' }}>
            <Typography
              variant="body1"
              fontSize={'1rem'}
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
          <TableCell sx={{ verticalAlign: 'center' }}>
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
                  size="medium"
                  variant="filled"
                  sx={{ mb: 0.5 }}
                  color="info"
                  
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
