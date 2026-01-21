import { TableHead, TableRow, TableCell } from "@mui/material";

const PlanTableHeader: React.FC = () => {
  return (
    <TableHead sx={{ bgcolor: 'primary.main' }}>
      <TableRow>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 'bold',
            width: '15%',
            fontSize: '1rem',
          }}
          align="center"
        >
          Дата
        </TableCell>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 'bold',
            width: '10%',
            fontSize: '1rem',
          }}
          align="center"
        >
          Время
        </TableCell>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 'bold',
            width: '55%',
            fontSize: '1rem',
          }}
          align="center"
        >
          Мероприятия
        </TableCell>
        <TableCell
          sx={{
            color: 'white',
            fontWeight: 'bold',
            width: '20%',
            fontSize: '1rem',
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