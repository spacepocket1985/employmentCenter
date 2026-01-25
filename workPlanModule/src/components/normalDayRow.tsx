import React from 'react';
import { TableRow, TableCell, Typography, Box } from '@mui/material';
import { DayPlan } from 'src/types/plan.types';
import {
  PRINT_CELL_STYLES,
  PRINT_TEXT_STYLES,
  PRINT_ROW_STYLES,
  PRINT_NO_BORDERS,
} from 'src/const/printStyles';

interface NormalDayRowProps {
  day: DayPlan;
  isFirstEvent?: boolean;
}

const NormalDayRow: React.FC<NormalDayRowProps> = ({ day, isFirstEvent }) => {
  return (
    <>
      {day.events.map((event, index) => {
        const isEvenRow = index % 2 === 0;
        const isLastEventInDay = index === day.events.length - 1;

        return (
          <TableRow
            key={`${day.id}-${event.id}`}
            sx={{
              bgcolor: isEvenRow ? '#ffffff' : '#f8f9fa',
              borderBottom: isLastEventInDay
                ? '2px solid #b0b0b0'
                : '1px solid #e0e0e0',
              '&:hover': {
                bgcolor: '#f0f4f8',
                transition: 'background-color 0.2s ease',
              },
              mb: isLastEventInDay ? 0.5 : 0,
              '@media print': PRINT_ROW_STYLES,
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
                  borderBottom: isLastEventInDay
                    ? '2px solid #b0b0b0'
                    : '1px solid #e0e0e0',
                  width: '15%',
                  '@media print': {
                    ...PRINT_CELL_STYLES,
                    color: 'black !important',
                  },
                }}
                align="center"
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="#103896"
                  fontSize={'1.5rem'}
                  sx={{
                    '@media print': PRINT_TEXT_STYLES,
                  }}
                >
                  {day.dayNumber}
                </Typography>
                <Typography
                  variant="body2"
                  color="#546e7a"
                  fontSize={'0.9rem'}
                  sx={{
                    textTransform: 'capitalize',
                    '@media print': PRINT_TEXT_STYLES,
                  }}
                >
                  {day.dayOfWeek}
                </Typography>
              </TableCell>
            ) : null}

            {/* Остальные ячейки */}
            {/* Время */}
            <TableCell
              sx={{
                verticalAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '10%',
                borderBottom: isLastEventInDay
                  ? '2px solid #b0b0b0'
                  : '1px solid #e0e0e0',
                '@media print': PRINT_CELL_STYLES,
              }}
              align="center"
            >
              <Typography
                variant="body1"
                fontSize={'0.95rem'}
                color="#37474f"
                sx={{
                  '@media print': PRINT_TEXT_STYLES,
                }}
              >
                {event.time || 'весь день'}
              </Typography>
            </TableCell>

            {/* Мероприятие */}
            <TableCell
              sx={{
                verticalAlign: 'center',
                borderRight: '1px solid #e0e0e0',
                width: '55%',
                borderBottom: isLastEventInDay
                  ? '2px solid #b0b0b0'
                  : '1px solid #e0e0e0',
                '@media print': PRINT_CELL_STYLES,
              }}
            >
              <Typography
                variant="body1"
                fontSize={'0.95rem'}
                sx={{
                  whiteSpace: 'pre-wrap',
                  '@media print': PRINT_TEXT_STYLES,
                }}
                color="#263238"
              >
                {event.description}
              </Typography>
            </TableCell>

            {/* Ответственные */}
            <TableCell
              sx={{
                verticalAlign: 'center',
                width: '20%',
                borderBottom: isLastEventInDay
                  ? '2px solid #b0b0b0'
                  : '1px solid #e0e0e0',
                '@media print': PRINT_CELL_STYLES,
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
                      backgroundColor: '#103896',
                      color: '#fff',
                      p: 1,
                      borderRadius: 2,
                      mr: 0.5,
                      '@media print': {
                        ...PRINT_TEXT_STYLES,
                        ...PRINT_NO_BORDERS, 
                        backgroundColor: 'white !important',
                        borderRadius: '0 !important',
                      },
                    }}
                  >
                    {person}
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
