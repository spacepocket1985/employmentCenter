import { Box, Chip, Typography } from '@mui/material';
import { formatDateWithoutSeconds } from '@utils/busRouteUtils';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';

type BusRouteTitleProps = {
  isActive: boolean;
  routeNumber: string;
  routeName: string | undefined;
  updatedAt: string;
  createdAt: string;
};
export const BusRouteTitle: React.FC<BusRouteTitleProps> = ({
  routeName,
  routeNumber,
  updatedAt,
  createdAt,
}) => {
  const busRouteTitle = `Маршрут №${routeNumber} ${
    routeName ? `(${routeName})` : ''
  }`;

  return (
    <Box display={'flex'} alignItems="center" gap={2} mb={2} component="div">
      <Typography
        component="span"
        sx={{
          typography: 'h5',
          background: 'linear-gradient(135deg, #103896, #1a4ec2)',
          color: 'white',
          p: '0.6rem 1rem',
          borderRadius: 2,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AirportShuttleIcon sx={{ fontSize: '2rem' }} />
        {busRouteTitle}
      </Typography>

      <Chip
        label={'Дата создания/изменения'}
        sx={{
          '@media print': {
            display: 'none !important',
          },
        }}
      />
      <Chip
        sx={{
          '@media print': {
            display: 'none !important',
          },
        }}
        label={
          updatedAt && updatedAt.length > 0
            ? formatDateWithoutSeconds(updatedAt)
            : formatDateWithoutSeconds(createdAt)
        }
        color={'success'}
      />
    </Box>
  );
};
