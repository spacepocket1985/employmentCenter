import React from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
} from '@mui/material';

import { getErrorMessage } from '@utils/errorUtils';

import { UICollectionInfo, UITableHead } from '@components/ui';
import { planListCellTitles } from 'src/const';
import {
  UIITableItemsActions,
  createDeleteHandler,
} from '@components/ui/UIITableItemsActions';
import { LoadingErrorWrapper } from '@components/layout';
import { useDeleteBusRouteMutation, useGetActiveBusRoutesQuery } from '@store/slices';
import { BusRouteModel } from 'src/types/busRoute.types';

export const BusRouteList: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetActiveBusRoutesQuery();
  const [deleteBusRouteMutation] = useDeleteBusRouteMutation();

  const handleExportBusRoute = (planId: string): void => {
    // TODO: Реализовать экспорт в PDF/Excel
    console.log('Export BusRoute:', planId);
  };

  const handleDeletePlan = createDeleteHandler(deleteBusRouteMutation);

  const busRoutes: BusRouteModel[] = data?.data || [];

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={getErrorMessage(error)}
      collectionLength={busRoutes.length}
      collectionTitle="маршруты транспорта"
    >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Маршруты движения транспорта
        </Typography>

        <TableContainer>
          <Table>
            <UITableHead cellTitels={planListCellTitles} />
            <TableBody>
              {busRoutes.map((busRoute: BusRouteModel) => {
                // const totalEvents = plan.days.reduce(
                //   (total, day) => total + day.events.length,
                //   0
                // );
                // const totalAnnouncements = plan.announcements?.length || 0;
                // const monthName = MONTHS[plan.monthNumber - 1];
                // const planTitle = `${monthName} ${plan.year}`;

                return (
                  <TableRow
                    key={busRoute._id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {'planTitle'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Гродненская ТЭЦ-2
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={busRoute.schedules.length}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={busRoute.routeName}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={busRoute.description}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        // label={plan.days.reduce(
                        //   (acc, day) => (day.isSpecialDay ? acc + 1 : acc),
                        //   0
                        // )}
                        label={'temp'}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        // label={
                        //   plan.workingSaturdays
                        //     ? plan.workingSaturdays.length
                        //     : 0
                        // }
                        label={'temp'}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Используем универсальный компонент действий */}
                    <UIITableItemsActions
                      itemId={busRoute._id!}
                      itemTitle={busRoute.routeName!}
                      viewOption={true}
                      editPath={`./${busRoute._id!}`}
                      onDelete={handleDeletePlan}
                      onRefetch={refetch}
                      onExport={handleExportBusRoute}
                      // customViewComponent={<WorkPlanView planId={plan._id!} />}
                      deleteConfirmText={`Вы уверены, что хотите удалить маршрут "${busRoute.routeNumber}"? Это действие нельзя отменить.`}
                      viewDialogTitle={`Просмотр маршрута ${busRoute.routeNumber}`}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <UICollectionInfo
          collectionTitle="Маршруты движения"
          collectionLength={busRoutes.length}
          onRefetch={refetch}
        />
      </Paper>
    </LoadingErrorWrapper>
  );
};


