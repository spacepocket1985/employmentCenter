import React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Alert,
  Typography,
} from '@mui/material';
import { LocalDayPlan, LocalAnnouncement } from 'src/types/workPlan.types';
import { ValidationError } from '@utils/validationPlan';

import PlanHeader from '../planHeader';
import DayRow from './dayRow';
import { TableHeader } from './tableHeader';
import AnnouncementRow from './announcementRow';
import { getErrorMessage } from '@utils/errorUtils';

interface PlanTableProps {
  mode?: 'create' | 'edit';
  days: LocalDayPlan[];
  announcements?: LocalAnnouncement[];
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
  validationErrors?: ValidationError[];
  hasEmptyDays?: boolean;
}

const PlanTable: React.FC<PlanTableProps> = ({
  mode = 'create',
  days,
  announcements = [],
  monthNumber,
  year,
  error,
  isSuccess,
  onAddEvent,
  onUpdateEventTime,
  onUpdateEventDescription,
  onUpdateEventResponsible,
  onRemoveEvent,
  validationErrors = [],
  hasEmptyDays = false,
}) => {
  const errorMessage = getErrorMessage(error);

  // Группируем анонсы по дням
  const announcementsByDay = React.useMemo(() => {
    const groups: Record<number, LocalAnnouncement[]> = {};
    announcements.forEach((announcement) => {
      if (!groups[announcement.dayNumber]) {
        groups[announcement.dayNumber] = [];
      }
      groups[announcement.dayNumber].push(announcement);
    });

    // Сортируем анонсы внутри дня по order
    Object.keys(groups).forEach((dayNumber) => {
      groups[Number(dayNumber)].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return groups;
  }, [announcements]);

  // Функция для получения ошибок для конкретного дня
  const getDayErrors = (dayNumber: number) => {
    return validationErrors.filter((error) => error.dayNumber === dayNumber);
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <PlanHeader monthNumber={monthNumber} year={year} />

      {mode === 'edit' && (
        <Typography variant="subtitle2" color="info.main" sx={{ mb: 2 }}>
          Режим редактирования. Внесите необходимые изменения и нажмите
          Сохранить изменения.
        </Typography>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {isSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Шаблон плана успешно создан!
        </Alert>
      )}

      {hasEmptyDays && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>Внимание:</strong> В плане есть дни без мероприятий. Добавьте
          мероприятия во все дни перед сохранением плана.
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHeader />
          <TableBody>
            {days.map((day) => {
              // Получаем анонсы для этого дня (если есть)
              const dayAnnouncements = announcementsByDay[day.dayNumber] || [];

              return (
                <React.Fragment key={day.id}>
                  {/* Отображаем анонсы перед днем */}
                  {dayAnnouncements.map((announcement) => (
                    <AnnouncementRow
                      key={announcement.id}
                      announcement={announcement}
                      dayOfWeek={day.dayOfWeek}
                    />
                  ))}

                  {/* Отображаем день с мероприятиями */}
                  <DayRow
                    day={day}
                    onAddEvent={onAddEvent}
                    onUpdateEventTime={onUpdateEventTime}
                    onUpdateEventDescription={onUpdateEventDescription}
                    onUpdateEventResponsible={onUpdateEventResponsible}
                    onRemoveEvent={onRemoveEvent}
                    eventErrors={getDayErrors(day.dayNumber)}
                  />
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default PlanTable;
