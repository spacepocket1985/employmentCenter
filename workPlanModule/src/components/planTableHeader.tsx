import { TableHead, TableRow, TableCell } from "@mui/material";
import { PRINT_TABLE_HEADER_STYLES } from 'src/const/printStyles';

const PlanTableHeader: React.FC = () => {
  return (
    <TableHead sx={{ 
      bgcolor: '#103896',
      '@media print': {
        bgcolor: 'white !important',
      }
    }}>
      <TableRow>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 600,
            width: '15%',
            fontSize: '0.95rem',
            borderRight: '1px solid #3a506b',
            py: 1.5,
            '@media print': PRINT_TABLE_HEADER_STYLES,
          }}
          align="center"
        >
          Дата
        </TableCell>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 600,
            width: '10%',
            fontSize: '0.95rem',
            borderRight: '1px solid #3a506b',
            py: 1.5,
            '@media print': PRINT_TABLE_HEADER_STYLES,
          }}
          align="center"
        >
          Время
        </TableCell>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 600,
            width: '55%',
            fontSize: '0.95rem',
            borderRight: '1px solid #3a506b',
            py: 1.5,
            '@media print': PRINT_TABLE_HEADER_STYLES,
          }}
          align="center"
        >
          Мероприятия
        </TableCell>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 600,
            width: '20%',
            fontSize: '0.95rem',
            py: 1.5,
            '@media print': PRINT_TABLE_HEADER_STYLES,
          }}
          align="center"
        >
          Ответственный за выполнение
        </TableCell>
      </TableRow>
    </TableHead>
  );
};

export default PlanTableHeader;