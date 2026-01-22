import { TableHead, TableRow, TableCell } from '@mui/material';

export const TodayEventsTableHeader: React.FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  return (
    <TableHead sx={{ bgcolor: '#f5f7fa' }}>
      <TableRow>
        <TableCell
          sx={{
            fontWeight: 600,
            fontSize: compact ? '0.85rem' : '0.9rem',
            color: '#2c3e50',
            borderBottom: '2px solid #3a506b',
            py: compact ? 1 : 1.2,
          }}
          align="center"
        >
          Время
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 600,
            fontSize: compact ? '0.85rem' : '0.9rem',
            color: '#2c3e50',
            borderBottom: '2px solid #3a506b',
            py: compact ? 1 : 1.2,
          }}
          align="center"
        >
          Мероприятия
        </TableCell>
        <TableCell
          sx={{
            fontWeight: 600,
            fontSize: compact ? '0.85rem' : '0.9rem',
            color: '#2c3e50',
            borderBottom: '2px solid #3a506b',
            py: compact ? 1 : 1.2,
          }}
          align="center"
        >
          Ответственный за выполнение
        </TableCell>
      </TableRow>
    </TableHead>
  );
};
