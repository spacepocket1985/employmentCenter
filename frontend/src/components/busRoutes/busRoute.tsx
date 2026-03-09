import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Box,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';

import { LoadingErrorWrapper } from '@components/layout';
import { UITableHead, UICollectionInfo } from '@components/ui';
import { useGetBusRouteQuery } from '@store/slices';
import { busRouteCellTitles, DAY_TYPE_LABELS } from 'src/const';

import { BusRouteModel, extractTime} from 'src/types/busRoute.types';

type BusRouteProps = { id: string };

export const BusRoute: React.FC<BusRouteProps> = ({ id }) => {
  const navigate = useNavigate();
 

  const { data, isLoading, error, refetch } = useGetBusRouteQuery(id, {
    skip: !id,
  });

  const busRouteData = data?.data;

  const busRoute: BusRouteModel = busRouteData || {
    _id: '',
    routeNumber: '',
    routeName: '',
    description: '',
    schedules: [
      {
        _id: '',
        period: 'morning',
        dayTypes: [],
        vehicles: [
          {
            model: '',
            capacity: undefined,
          },
        ],
        busStops: [
          {
            orderNumber: 1,
            name: '',
            address: '',
            time: { type: 'text', text: '' },
            isSpecialNote: false,
          },
        ],
        notes: '',
      },
    ],
    isActive: true,
    createdAt: '',
    updatedAt: '',
  };
  console.log(busRouteData)
  const busRouteTitle = `Маршрут №${busRoute.routeNumber} (${busRoute.routeName})`;

  /**
   * Обработчик перехода к редактированию
   */
  const handleEdit = (): void => {
    navigate(`./${id}`);
  };

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={error}
      isCollectionObject={true}
    >
      <Paper sx={{ p: 2 }}>
        {/* Шапка с кнопками навигации */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Tooltip title="Редактировать график">
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              size="medium"
            >
              Редактировать
            </Button>
          </Tooltip>
        </Box>

        {/* Заголовок графика */}
        <Box display={'flex'}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            {busRouteTitle}
          </Typography>
        </Box>

        {busRoute.schedules.map((item) => (
          <>
            {item.dayTypes.map((i, index) => (
              <Chip key={index} label={DAY_TYPE_LABELS[i]} color="success" />
            ))}
            <TableContainer>
              <Table size="small">
                <UITableHead cellTitels={busRouteCellTitles} />
                <TableBody>
                  {item.busStops.map((busStop) => (
                    <TableRow
                      key={busStop.orderNumber}
                      hover
                      sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell>
                        <Typography variant="body1" fontWeight="medium">
                          <Chip label={busStop.orderNumber} />
                        </Typography>
                      </TableCell>

                      <TableCell align="left">{busStop.name}</TableCell>

                      <TableCell align="left">{busStop.address}</TableCell>

                      <TableCell align="left">{extractTime(busStop.time)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        ))}

        <UICollectionInfo
          collectionTitle={`расписания маршрута`}
          collectionLength={busRoute.schedules.length}
          onRefetch={refetch}
        />
      </Paper>
    </LoadingErrorWrapper>
  );
};
