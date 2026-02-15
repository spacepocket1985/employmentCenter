import { TableCell, TableHead, TableRow } from '@mui/material';

type UITableProps = {
  cellTitels: string[];
  compactMode?: boolean;
};

export const UITableHead: React.FC<UITableProps> = ({
  cellTitels,
  compactMode = false,
}) => {
  const rowStyles = {
    bgcolor: 'grey.100',
    '@media print': {
      bgcolor: 'transparent !important',
    },
  };

  const cellStyles = {
    fontWeight: 'bold',
    ...(compactMode && {
      py: 2,
      fontSize: '0.75rem',
    }),
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
