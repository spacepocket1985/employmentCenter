import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Chip,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';

import { MONTHS } from '@utils/dateUtils';
import { getErrorMessage } from '@utils/errorUtils';
import {
  useDeleteWorkPlanMutation,
  useGetAllWorkPlansQuery,
} from '@store/slices/workPlanApiSlice';
import WorkPlanView from './workPlanView';

import { UITableHead } from '@components/ui';
import { planListCellTitles } from 'src/const';
import {
  UIITableItemsActions,
  createDeleteHandler,
} from '@components/ui/UIITableItemsActions';
import { WorkPlan } from 'src/types/workPlan.types';

const WorkPlanList: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetAllWorkPlansQuery();
  const [deleteWorkPlanMutation] = useDeleteWorkPlanMutation();

  const handleExportPlan = (planId: string): void => {
    // TODO: Реализовать экспорт в PDF/Excel
    console.log('Export plan:', planId);
  };

  const handleDeletePlan = createDeleteHandler(deleteWorkPlanMutation);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {getErrorMessage(error)}
      </Alert>
    );
  }

  const plans: WorkPlan[] = data?.data || [];

  if (plans.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Планы не найдены
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Создайте первый план мероприятий
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Список планов мероприятий
        </Typography>

        <TableContainer>
          <Table>
            <UITableHead cellTitels={planListCellTitles} />
            <TableBody>
              {plans.map((plan: WorkPlan) => {
                const totalEvents = plan.days.reduce(
                  (total, day) => total + day.events.length,
                  0
                );
                const totalAnnouncements = plan.announcements?.length || 0;
                const monthName = MONTHS[plan.monthNumber - 1];
                const planTitle = `${monthName} ${plan.year}`;

                return (
                  <TableRow
                    key={plan._id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {planTitle}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Гродненская ТЭЦ-2
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={plan.days.length}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={totalEvents}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={totalAnnouncements}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={plan.days.reduce(
                          (acc, day) => (day.isSpecialDay ? acc + 1 : acc),
                          0
                        )}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={
                          plan.workingSaturdays
                            ? plan.workingSaturdays.length
                            : 0
                        }
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    {/* Используем универсальный компонент действий */}
                    <UIITableItemsActions
                      itemId={plan._id!}
                      itemTitle={planTitle}
                      viewOption={true}
                      editPath={`./${plan._id}`}
                      onDelete={handleDeletePlan}
                      onRefetch={refetch}
                      onExport={handleExportPlan}
                      customViewComponent={<WorkPlanView planId={plan._id!} />}
                      deleteConfirmText={`Вы уверены, что хотите удалить план "${planTitle}"? Это действие нельзя отменить.`}
                      viewDialogTitle={`Просмотр плана ${planTitle}`}
                    />
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
          sx={{
            mt: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Всего планов: {plans.length}
          </Typography>

          <Button variant="outlined" onClick={() => refetch()} size="small">
            Обновить список
          </Button>
        </Box>
      </Paper>
    </>
  );
};

export default WorkPlanList;
