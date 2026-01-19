import React, { useState } from 'react';

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

import { MONTHS } from '@utils/dateUtils';
import { getErrorMessage } from '@utils/errorUtils';
import {
  useDeleteWorkPlanMutation,
  useGetAllWorkPlansQuery,
} from '@store/slices/workPlanApiSlice';
import WorkPlanView from './workPlanView';

const WorkPlanList: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetAllWorkPlansQuery();
  const [deleteWorkPlan] = useDeleteWorkPlanMutation();

  const [viewPlanId, setViewPlanId] = useState<string | null>(null);
  const [deleteConfirmPlanId, setDeleteConfirmPlanId] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDeletePlan = async () => {
    if (!deleteConfirmPlanId) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteWorkPlan(deleteConfirmPlanId).unwrap();
      setDeleteConfirmPlanId(null);
      refetch();
    } catch (err) {
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportPlan = (planId: string) => {
    // TODO: Реализовать экспорт в PDF/Excel
    console.log('Export plan:', planId);
  };

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

  const plans = data?.data || [];

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
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Месяц и год</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Дней</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Мероприятий</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Анонсов</TableCell>{' '}
                {/* Новая колонка */}
                <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  Действия
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {plans.map((plan) => {
                const totalEvents = plan.days.reduce(
                  (total, day) => total + day.events.length,
                  0
                );
                const totalAnnouncements = plan.announcements?.length || 0; // Новый подсчет
                const monthName = MONTHS[plan.monthNumber - 1];

                return (
                  <TableRow
                    key={plan._id}
                    hover
                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {monthName} {plan.year}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Гродненская ТЭЦ-2
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={plan.days.length}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={totalEvents}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      {' '}
                      {/* Новая ячейка */}
                      <Chip
                        label={totalAnnouncements}
                        size="small"
                        color="info"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Просмотреть">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => {
                              console.log(plan);
                              setViewPlanId(plan._id!);
                            }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => {
                              // TODO: Переход к редактированию
                              console.log('Edit plan:', plan._id);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Экспортировать">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => handleExportPlan(plan._id!)}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteConfirmPlanId(plan._id!)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
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

      {/* Диалог просмотра плана */}
      <Dialog
        open={!!viewPlanId}
        onClose={() => setViewPlanId(null)}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ pb: 1 }}>Просмотр плана мероприятий</DialogTitle>
        <DialogContent dividers>
          {viewPlanId && <WorkPlanView planId={viewPlanId} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewPlanId(null)} color="primary">
            Закрыть
          </Button>
          <Button
            onClick={() => {
              if (viewPlanId) handleExportPlan(viewPlanId);
            }}
            variant="contained"
            startIcon={<DownloadIcon />}
          >
            Экспортировать
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog
        open={!!deleteConfirmPlanId}
        onClose={() => !isDeleting && setDeleteConfirmPlanId(null)}
      >
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <Typography>
            Вы уверены, что хотите удалить этот план? Это действие нельзя
            отменить.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteConfirmPlanId(null)}
            disabled={isDeleting}
          >
            Отмена
          </Button>
          <Button
            onClick={handleDeletePlan}
            color="error"
            variant="contained"
            disabled={isDeleting}
            startIcon={isDeleting ? <CircularProgress size={20} /> : null}
          >
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WorkPlanList;
