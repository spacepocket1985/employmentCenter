import { TableHead, TableRow, TableCell } from "@mui/material";

const PlanTableHeader: React.FC = () => {
  return (
    <TableHead sx={{ bgcolor: '#2c3e50' }}>
      <TableRow>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 600,
            width: '15%',
            fontSize: '0.95rem',
            borderRight: '1px solid #3a506b',
            py: 1.5
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
            py: 1.5
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
            py: 1.5
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
            py: 1.5
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