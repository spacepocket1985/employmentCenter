import { TableCell, TableHead, TableRow } from '@mui/material';

type UITableProps = {
  cellTitels: string[];
};

export const UITableHead: React.FC<UITableProps> = ({ cellTitels }) => {
  const cellStyles = { fontWeight: 'bold' };
  const renderCells = cellTitels.map((title, index) => {
    return (
      <TableCell
        key={index}
        sx={cellStyles}
        align={index === 0 ? 'left' : 'center'}
      >
        {title}
      </TableCell>
    );
  });
  return (
    <TableHead>
      <TableRow sx={{ bgcolor: 'grey.100' }}>{renderCells}</TableRow>
    </TableHead>
  );
};
