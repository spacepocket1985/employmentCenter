import { TableRow, TableCell, Typography, Box } from '@mui/material';
import { Event } from 'src/types/plan.types';

interface EventRowProps {
  event: Event;
  index: number;
  compact?: boolean;
}

export const EventRow: React.FC<EventRowProps> = ({
  event,
  index,
  compact = false,
}) => {
  return (
    <TableRow
      sx={{
        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
        '&:hover': {
          backgroundColor: '#f0f4f8',
        },
      }}
    >
      <TableCell
        sx={{
          borderRight: '1px solid #e0e0e0',
          py: compact ? 1 : 1.5,
          fontWeight: 500,
          color: '#37474f',
          fontSize: compact ? '0.85rem' : '0.9rem',
          width: '15%',
        }}
        align="center"
      >
        {event.time || 'весь день'}
      </TableCell>
      <TableCell
        sx={{
          borderRight: '1px solid #e0e0e0',
          py: compact ? 1 : 1.5,
          width: '60%',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            whiteSpace: 'pre-wrap',
            color: '#263238',
            fontSize: compact ? '0.85rem' : '0.9rem',
            lineHeight: 1.4,
          }}
        >
          {event.description}
        </Typography>
        {event.notes && (
          <Typography
            variant="caption"
            color="#78909c"
            sx={{
              display: 'block',
              mt: 0.5,
              fontStyle: 'italic',
              fontSize: compact ? '0.75rem' : '0.8rem',
            }}
          >
            Примечание: {event.notes}
          </Typography>
        )}
      </TableCell>
      <TableCell
        sx={{
          py: compact ? 1 : 1.5,
          width: '25%',
        }}
      >
        <Box>
          {event.responsiblePersons.map((person, idx) => (
            <Typography
              key={idx}
              variant="body2"
              component="span"
              color="#455a64"
              sx={{
                display: 'block',
                mb: idx < event.responsiblePersons.length - 1 ? 0.5 : 0,
                fontSize: compact ? '0.8rem' : '0.85rem',
                lineHeight: 1.3,
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
};
