import React from 'react';
import { TableCell, Box, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { LocalEvent } from 'src/types/workPlan.types';
import ActivitySelect from './activitySelect';
import ResponsibleSelect from './responsibleSelect';
import TimeSelect from './timeSelect';

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
}

const EventRow: React.FC<EventRowProps> = ({
  event,
  dayId,
  onUpdateTime,
  onUpdateDescription,
  onUpdateResponsible,
  onRemoveEvent,
}) => {
  return (
    <>
      <TableCell sx={{ width: '10%' }}>
        <TimeSelect
          value={event.time}
          onChange={(t) => onUpdateTime(dayId, event.id, t)}
        />
      </TableCell>
      <TableCell sx={{ width: '55%' }}>
        <ActivitySelect
          value={event.description}
          onChange={(value) => onUpdateDescription(dayId, event.id, value)}
          placeholder="Выберите или введите мероприятие"
          TextFieldProps={{
            size: 'small',
            fullWidth: true,
            sx: {
              '& .MuiInputBase-root': {
                fontSize: '1rem',
              },
            },
          }}
        />
      </TableCell>
      <TableCell sx={{ width: '30%' }}>
        <ResponsibleSelect
          value={event.responsiblePersons}
          onChange={(value) => onUpdateResponsible(dayId, event.id, value)}
          TextFieldProps={{
            size: 'small',
            fullWidth: true,
            sx: {
              '& .MuiInputBase-root': {
                fontSize: '0.875rem',
              },
              '& .MuiFormHelperText-root': {
                fontSize: '0.75rem',
                marginTop: 0.5,
              },
            },
          }}
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
            variant="contained"
          >
            Удалить мероприятие
          </Button>
        </Box>
      </TableCell>
    </>
  );
};

export default EventRow;
