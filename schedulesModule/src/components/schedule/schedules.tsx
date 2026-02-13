import { LoadingErrorWrapper } from '@components/layout/loadingErrorWrapper';
import { useSchedulesData } from '@hooks/useSchedulesData';
import { Schedule } from './schedule';
import { Stack } from '@mui/material';

interface SchedulesProps {
  showPrintButton?: boolean;
  printTitle?: string;
}

export const Schedules: React.FC<SchedulesProps> = ({
  showPrintButton = true,
  printTitle = 'Графики дежурств и проведения проверок Гродненской ТЭЦ-2',
}) => {
  const { data, isLoading, error, refetch } = useSchedulesData();
  const schedules = data || [];

  return (
    <LoadingErrorWrapper
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      collectionLength={schedules.length}
      collectionTitle=" графиков дежурств"
      showPrintButton={showPrintButton}
      printDocumentTitle={printTitle}
    >
      <Stack spacing={3}>
        {schedules.map((item) => (
          <Schedule key={item._id} schedule={item} />
        ))}
      </Stack>
    </LoadingErrorWrapper>
  );
};
