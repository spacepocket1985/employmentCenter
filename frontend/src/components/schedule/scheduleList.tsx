import { useDeleteScheduleMutation, useGetSchedulesQuery } from '@store/slices';
import { useNavigate } from 'react-router-dom';

import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
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
  const navigate = useNavigate();

  const {
    data,
    isLoading: isLoadingSchedules,
    error: schedulesError,
    refetch,
  } = useGetSchedulesQuery({});

  const [deleteScheduleMutation] = useDeleteScheduleMutation();

  const isLoading = isLoadingSchedules;
  const error = schedulesError;
  const schedules = data?.data || [];

  const handleDeletePlan = createDeleteHandler(deleteScheduleMutation);

  const handleCreate = (): void => {
    navigate('./create');
  };

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={error}
      collectionLength={schedules.length}
      collectionTitle="графики дежурств/проверок"
    >
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Список графиков дежурств/проведения проверок
          </Typography>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Создать график
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <UITableHead cellTitels={scheduleListCellTitles} />
            <TableBody>
              {schedules.map((schedule) => {
                const totalDays = schedule.entries.reduce(
                  (total, entry) => total + entry.dates.length,
                  0
                );

                const scheduleTitle =
                  SCHEDULE_TITLES[schedule.scheduleType]?.shortTitle ||
                  'График';
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

                    <UIITableItemsActions
                      itemId={schedule._id}
                      itemTitle={`${scheduleTitle} на ${monthName} ${year}`}
                      viewOption={true}
                      editPath={`./${schedule._id}`}
                      onDelete={handleDeletePlan}
                      onRefetch={refetch}
                      deleteConfirmText={`Вы уверены, что хотите удалить график "${scheduleTitle} на ${monthName} ${year}"?`}
                      viewDialogTitle={`Просмотр графика: ${scheduleTitle} на ${monthName} ${year}`}
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
