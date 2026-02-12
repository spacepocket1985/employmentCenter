import { useDeleteScheduleMutation, useGetSchedulesQuery } from '@store/slices';

import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { LoadingErrorWrapper } from '@components/layout';
import { UICollectionInfo, UITableHead } from '@components/ui';
import { SCHEDULE_TITLES, scheduleListCellTitles } from 'src/const';
import {
  createDeleteHandler,
  UIITableItemsActions,
} from '@components/ui/UIITableItemsActions';
import { parseScheduleDate } from '@utils/scheduleDateUtils';
import { Schedule } from './schedule';


export const ScheduleList: React.FC = () => {
  const {
    data,
    isLoading: isLoadingSchedules,
    error: schedulesError,
    refetch,
  } = useGetSchedulesQuery({});

  const [deleteScheduleMutation] = useDeleteScheduleMutation();

  const isLoading = isLoadingSchedules;
  const eroor = schedulesError;

  const schedules = data?.data || [];

  console.log(schedules);

  const handleExportPlan = (planId: string): void => {
    // TODO: Реализовать экспорт в PDF/Excel
    console.log('Export plan:', planId);
  };

  const handleDeletePlan = createDeleteHandler(deleteScheduleMutation);

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={eroor}
      collectionLength={schedules.length}
      collectionTitle="графики дежурств/проверок"
    >
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Список графиков дежурств/проведения проверок
        </Typography>

        <TableContainer>
          <Table>
            <UITableHead cellTitels={scheduleListCellTitles} />
            <TableBody>
              {schedules.map((schedule) => {
                const totalDays = schedule.entries.reduce(
                  (total, day) => total + day.dates.length,
                  0
                );

                const scheduleTitle =
                  SCHEDULE_TITLES[schedule.scheduleType].shortTitle;
                const { year, month: monthName } = parseScheduleDate(
                  schedule.month
                );

                return (
                  <TableRow
                    key={schedule._id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {`${monthName} ${year}`}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">{scheduleTitle}</TableCell>

                    <TableCell align="center">
                      <Chip
                        label={schedule.entries.length}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={totalDays}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Используем универсальный компонент действий */}
                    <UIITableItemsActions
                      itemId={schedule._id!}
                      itemTitle={scheduleTitle}
                      viewOption={true}
                      editPath={`./${schedule._id}`}
                      onDelete={handleDeletePlan}
                      onRefetch={refetch}
                      onExport={handleExportPlan}
                      deleteConfirmText={`Вы уверены, что хотите удалить "${scheduleTitle}"? Это действие нельзя отменить.`}
                      viewDialogTitle={`Просмотр графика`}
                      customViewComponent={<Schedule id={schedule._id} />}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <UICollectionInfo
          collectionTitle="Графики"
          collectionLength={schedules.length}
          onRefetch={refetch}
        />
      </Paper>
    </LoadingErrorWrapper>
  );
};
