import React from 'react';
import { TableRow, TableCell, Typography, Button, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { LocalDayPlan } from 'src/types/workPlan.types';
import { ValidationError } from '@utils/validationPlan';
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
  eventErrors?: ValidationError[];
}

const DayRow: React.FC<DayRowProps> = ({
  day,
  onAddEvent,
  onUpdateEventTime,
  onUpdateEventDescription,
  onUpdateEventResponsible,
  onRemoveEvent,
  eventErrors = [],
}) => {
  // Для специального дня первое мероприятие - это название спец. дня
  const isSpecialDay = day.isSpecialDay;
  const specialTitle = day.specialDayTitle;
  
  // Обычные мероприятия НЕ отрисовываются для специальных дней
  const regularEvents = isSpecialDay ? [] : day.events;

  // Группируем ошибки по событиям (только для обычных дней)
  const errorsByEvent = React.useMemo(() => {
    const groups: Record<number, ValidationError[]> = {};
    
    if (isSpecialDay) return groups; // Для спец. дней не группируем ошибки
    
    eventErrors.forEach(error => {
      if (error.eventIndex >= 1) { // eventIndex начинается с 1 для первого события
        const adjustedEventIndex = error.eventIndex - 1;
        if (!groups[adjustedEventIndex]) {
          groups[adjustedEventIndex] = [];
        }
        groups[adjustedEventIndex].push(error);
      }
    });
    return groups;
  }, [eventErrors, isSpecialDay]);

  // Получаем ошибки для конкретного обычного события
  const getEventErrors = (eventIndex: number) => {
    return errorsByEvent[eventIndex] || [];
  };

  // Считаем ошибки только для обычных дней
  const totalErrors = React.useMemo(() => {
    if (isSpecialDay) return 0; // Для специальных дней ошибок нет
    return eventErrors.length;
  }, [eventErrors, isSpecialDay]);

  // Определяем rowSpan для ячейки даты
  const getDateRowSpan = () => {
    if (isSpecialDay) {
      return 1; // Только одна строка для специального дня
    }
    if (regularEvents.length > 0) {
      return regularEvents.length + 1; // +1 для строки кнопки добавления
    }
    return 1; // Только строка с кнопкой "Добавить мероприятие"
  };

  return (
    <React.Fragment key={day.id}>
      {/* Строка с датой и специальным днем */}
      <TableRow sx={{ 
        bgcolor: totalErrors > 0 ? 'error.50' : 'grey.50',
        borderLeft: totalErrors > 0 ? '4px solid' : 'none',
        borderColor: 'error.main',
      }}>
        <TableCell
          rowSpan={getDateRowSpan()}
          sx={{ 
            width: '10%', 
            backgroundColor: isSpecialDay ? 'warning.main' : 'primary.main',
            borderRight: 2,
            borderColor: 'divider',
            position: 'relative',
            verticalAlign: 'top',
          }}
          align="center"
        >
          <Typography variant="h4" fontWeight="bold" color="white">
            {day.dayNumber}
          </Typography>
          <Typography variant="body2" color="white" fontSize="0.9rem">
            {day.dayOfWeek}
          </Typography>
          
          {totalErrors > 0 && !isSpecialDay && (
            <Box sx={{ 
              mt: 1,
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}>
              <Box 
                sx={{ 
                  bgcolor: 'error.main',
                  borderRadius: 1,
                  px: 1,
                  py: 0.5,
                  minWidth: 60,
                }}
              >
                <Typography 
                  variant="caption" 
                  color="white" 
                  sx={{ 
                    fontWeight: 'bold',
                    display: 'block',
                    textAlign: 'center',
                  }}
                >
                  {totalErrors} {totalErrors === 1 ? 'ошибка' : 
                    totalErrors > 1 && totalErrors < 5 ? 'ошибки' : 'ошибок'}
                </Typography>
              </Box>
            </Box>
          )}
        </TableCell>

        {/* Для специального дня показываем одну объединенную строку */}
        {isSpecialDay && specialTitle ? (
          <TableCell 
            colSpan={3} 
            sx={{ 
              width: '90%',
              bgcolor: 'warning.light',
              padding: '16px !important',
            }}
          >
            <Typography 
              variant="body1" 
              color="primary" 
              fontWeight="bold"
              sx={{ 
                textTransform: 'uppercase',
                textAlign: 'center',
                fontSize: '1.1rem',
              }}
            >
              {specialTitle}
            </Typography>
          </TableCell>
        ) : regularEvents.length === 0 ? (
          // Пустой день (без мероприятий)
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
        ) : null}
      </TableRow>

      {/* Строки с обычными мероприятиями (только для НЕ специальных дней) */}
      {!isSpecialDay && regularEvents.map((event, index) => {
        const errors = getEventErrors(index);
        const hasErrors = errors.length > 0;
        
        return (
          <TableRow 
            key={event.id} 
            sx={{ 
              '& td': { verticalAlign: 'top' },
              bgcolor: hasErrors ? 'error.50' : 'transparent',
            }}
          >
            <EventRow
              event={event}
              dayId={day.id}
              onUpdateTime={onUpdateEventTime}
              onUpdateDescription={onUpdateEventDescription}
              onUpdateResponsible={onUpdateEventResponsible}
              onRemoveEvent={onRemoveEvent}
              errors={errors}
            />
          </TableRow>
        );
      })}

      {/* Кнопка добавления мероприятия для обычных дней, где уже есть события */}
      {!isSpecialDay && regularEvents.length > 0 && (
        <TableRow>
          <TableCell
            colSpan={4}
            sx={{
              borderTop: 1,
              borderColor: 'divider',
              width: '100%',
              bgcolor: totalErrors > 0 ? 'error.50' : 'transparent',
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