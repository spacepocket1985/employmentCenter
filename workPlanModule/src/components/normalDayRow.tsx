import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import { DayPlan } from 'src/types/plan.types';

interface NormalDayRowProps {
  day: DayPlan;
  isFirstEvent?: boolean;
}

const NormalDayRow: React.FC<NormalDayRowProps> = ({ day, isFirstEvent }) => {
  return (
    <>
      {day.events.map((event, index) => {
        const isEvenRow = index % 2 === 0;

        return (
          <TableRow
            key={`${day.id}-${event.id}`}
            sx={{
              bgcolor: isEvenRow ? '#ffffff' : '#f8f9fa',
              borderBottom: '1px solid #e0e0e0',
              '&:hover': {
                bgcolor: '#f0f4f8',
                transition: 'background-color 0.2s ease',
              },
            }}
          >
            {/* Дата - показываем только для первого мероприятия дня */}
            {isFirstEvent && index === 0 ? (
              <TableCell
                rowSpan={day.events.length}
                sx={{
                  verticalAlign: 'center',
                  borderRight: '1px solid #e0e0e0',
                  backgroundColor: '#f5f7fa',
                  borderBottom: '1px solid #e0e0e0',
                  width: '15%',
                }}
                align="center"
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#2c3e50"
                  fontSize={'1.5rem'}
                >
                  {day.dayNumber}
                </Typography>
                <Typography
                  variant="body2"
                  color="#546e7a"
                  fontSize={'0.9rem'}
                  sx={{ textTransform: 'capitalize' }}
                >
                  {day.dayOfWeek}
                </Typography>
              </TableCell>
            ) : null}

            {/* Время */}
            <TableCell
              sx={{
                verticalAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '10%',
              }}
              align="center"
            >
              <Typography variant="body1" fontSize={'0.95rem'} color="#37474f">
                {event.time || 'весь день'}
              </Typography>
            </TableCell>

            {/* Мероприятие */}
            <TableCell
              sx={{
                verticalAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '55%',
              }}
            >
              <Typography
                variant="body1"
                fontSize={'0.95rem'}
                sx={{ whiteSpace: 'pre-wrap' }}
                color="#263238"
              >
                {event.description}
              </Typography>
              {event.notes && (
                <Typography
                  variant="body2"
                  color="#78909c"
                  sx={{
                    display: 'block',
                    mt: 1,
                    fontStyle: 'italic',
                    fontSize: '0.85rem',
                  }}
                >
                  {event.notes}
                </Typography>
              )}
            </TableCell>

            {/* Ответственные */}
            <TableCell
              sx={{
                verticalAlign: 'center',
                width: '20%',
              }}
            >
              <Box>
                {event.responsiblePersons.map((person, idx) => (
                  <Typography
                    key={idx}
                    variant="body1"
                    component={'span'}
                    color="#455a64"
                    align="center"
                    sx={{
                      mb: idx < event.responsiblePersons.length - 1 ? 0.5 : 0,
                      fontSize: '0.9rem',
                      backgroundColor: '#2c3e50',
                      color: '#fff',
                      p: 1,
                      borderRadius: 2,
                      mr: 0.5,
                    }}
                  >
                    {person}
                    {idx < event.responsiblePersons.length - 1 && ','}
                  </Typography>
                ))}
              </Box>
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default NormalDayRow;
