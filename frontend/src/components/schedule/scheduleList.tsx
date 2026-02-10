import { useGetSchedulesQuery } from '@store/slices';
import LoadingErrorWrapper from './loadingErrorWrapper';
import { Paper, Typography } from '@mui/material';

export const ScheduleList: React.FC = () => {
  const {
    data,
    isLoading: isLoadingSchedules,
    error: schedulesError,
  } = useGetSchedulesQuery({});

  const isLoading = isLoadingSchedules;
  const eroor = schedulesError;

  const schedules = data?.data || [];

  if (schedules.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Графики не найдены
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Создайте графики
        </Typography>
      </Paper>
    );
  }

  console.log(schedules);

  return (
    <LoadingErrorWrapper isLoading={isLoading} error={eroor}>
      <div>schedules</div>
    </LoadingErrorWrapper>
  );
};
