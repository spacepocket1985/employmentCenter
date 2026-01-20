import React from 'react';
import { TableCell, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalEvent } from 'src/types/workPlan.types';
import { ValidationError } from '@utils/validationPlan';
import ActivitySelect from '../dataSelectors/activitySelect';
import ResponsibleSelect from '../dataSelectors/responsibleSelect';
import TimeSelect from '../dataSelectors/timeSelect';

interface EventRowProps {
  event: LocalEvent;
  dayId: string;
  onUpdateTime: (dayId: string, eventId: string, time: string) => void;
  onUpdateDescription: (
    dayId: string,
    eventId: string,
    description: string
  ) => void;
  onUpdateResponsible: (
    dayId: string,
    eventId: string,
    responsiblePersons: string[]
  ) => void;
  onRemoveEvent: (dayId: string, eventId: string) => void;
  errors?: ValidationError[];
}

const EventRow: React.FC<EventRowProps> = ({
  event,
  dayId,
  onUpdateTime,
  onUpdateDescription,
  onUpdateResponsible,
  onRemoveEvent,
  errors = [],
}) => {
  const hasTimeError = errors.some((e) => e.field === 'time');
  const hasDescriptionError = errors.some((e) => e.field === 'description');
  const hasResponsibleError = errors.some(
    (e) => e.field === 'responsiblePersons'
  );

  const getErrorMessage = (
    field: 'time' | 'description' | 'responsiblePersons'
  ) => {
    const error = errors.find((e) => e.field === field);
    return error ? error.message : '';
  };

  return (
    <>
      <TableCell sx={{ width: '10%' }}>
        <TimeSelect
          value={event.time}
          onChange={(t) => onUpdateTime(dayId, event.id, t)}
          error={hasTimeError}
          helperText={getErrorMessage('time')}
        />
      </TableCell>
      <TableCell sx={{ width: '55%' }}>
        <ActivitySelect
          value={event.description}
          onChange={(value) => onUpdateDescription(dayId, event.id, value)}
          placeholder="Выберите или введите мероприятие"
          error={hasDescriptionError}
          helperText={getErrorMessage('description')}
        />
      </TableCell>
      <TableCell sx={{ width: '30%' }}>
        <ResponsibleSelect
          value={event.responsiblePersons}
          onChange={(value) => onUpdateResponsible(dayId, event.id, value)}
          error={hasResponsibleError}
          helperText={getErrorMessage('responsiblePersons')}
        />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 1,
          }}
        >
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => onRemoveEvent(dayId, event.id)}
            color="error"
            sx={{ fontSize: '0.75rem' }}
            variant="outlined"
            size="small"
          >
            Удалить
          </Button>
        </Box>
      </TableCell>
    </>
  );
};

export default EventRow;
