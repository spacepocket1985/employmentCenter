import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { DirectionsBus as DirectionsBusIcon } from '@mui/icons-material';
import MapIcon from '@mui/icons-material/Map';
import ManIcon from '@mui/icons-material/Man';
import { BusRouteSchedule } from 'src/types/busRoute.types';
import { getPeriodLabel } from '@utils/busRouteUtils';
import { BusRouteDayType } from './busRouteDayType';
import { RouteMapCard } from './routeMapCard';

type BusRouteInfoProps = {
  schedule: BusRouteSchedule;
  routeNumber: string;
  routeName?: string;
  description?: string;
};

export const BusRouteInfo: React.FC<BusRouteInfoProps> = ({
  schedule,
  routeNumber,
  routeName,
  description,
}) => {
  const [viewRouteMap, setViewRouteMap] = useState<string | null>(null);
  const { modelsString, capacitiesString } = useMemo(() => {
    const joinVehicleValues = (
      vehicles: { model: string; capacity?: number }[],
      key: 'model' | 'capacity'
    ): string => {
      if (!vehicles.length) return key === 'model' ? 'Нет ТС' : '—';

      const values = vehicles
        .map((v) => v[key])
        .filter(
          (value): value is string | number =>
            value !== undefined && value !== null && value !== ''
        );

      return values.length
        ? values.join(' / ')
        : key === 'model'
        ? 'Модель не указана'
        : '—';
    };

    return {
      modelsString: joinVehicleValues(schedule.vehicles, 'model'),
      capacitiesString: joinVehicleValues(schedule.vehicles, 'capacity'),
    };
  }, [schedule.vehicles]);

  return (
    <Box
      component="div"
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        mb: 2,
        p: 1,
        bgcolor: schedule.period === 'morning' ? 'warning.50' : 'primary.50',
        borderRadius: 1,
      }}
    >
      <Typography
        variant="h6"
        component="span"
        color={schedule.period === 'morning' ? 'warning.main' : 'primary.main'}
        sx={{ display: 'inline-block' }}
      >
        {getPeriodLabel(schedule.period)}
      </Typography>

      <Stack direction="row" spacing={1} component="span">
        <BusRouteDayType daysType={schedule.dayTypes} />

        <Chip
          className="no-print"
          label={
            <span>
              <strong>Модель транспорта:</strong> {modelsString}
            </span>
          }
          icon={<DirectionsBusIcon />}
          variant="outlined"
          component="span"
        />

        <Chip
          className="no-print"
          label={
            <span>
              <strong>Вместительность:</strong> {capacitiesString}
            </span>
          }
          icon={<ManIcon />}
          variant="outlined"
          component="span"
        />
        {schedule.routeMap && (
          <Chip
            className="no-print"
            label={
              <span>
                <strong>Карта маршрута</strong>
              </span>
            }
            icon={<MapIcon />}
            variant="outlined"
            component="span"
            onClick={() => setViewRouteMap(schedule.routeMap!)}
          />
        )}
      </Stack>

      <Dialog
        open={!!viewRouteMap}
        onClose={() => setViewRouteMap(null)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>{'Карта маршрута'}</DialogTitle>
        <DialogContent dividers>
          {schedule.routeMap && (
            <RouteMapCard
              routeMap={schedule.routeMap!}
              routeNumber={routeNumber}
              routeName={routeName}
              description={description}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewRouteMap(null)} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
