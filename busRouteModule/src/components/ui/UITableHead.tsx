import { TableCell, TableHead, TableRow } from '@mui/material';

type UITableProps = {
  cellTitels: string[];
};

export const UITableHead: React.FC<UITableProps> = ({ cellTitels }) => {
  const rowStyles = {
    bgcolor: 'grey.100',
    '@media print': {
      bgcolor: 'transparent !important',
    },
  };

  const cellStyles = {
    fontWeight: 'bold',
    background: '#103896',
    typography: 'h6',
    color: 'white',
    p: 1,
  };

  const renderCells = cellTitels.map((title, index) => (
    <TableCell
      key={index}
      sx={cellStyles}
      align={index === 0 ? 'left' : 'center'}
    >
      {title}
    </TableCell>
  ));

  return (
    <TableHead>
      <TableRow sx={rowStyles}>{renderCells}</TableRow>
    </TableHead>
  );
};
