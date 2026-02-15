import { LoadingErrorWrapper } from '@components/layout/loadingErrorWrapper';
import { Schedule } from './schedule';
import { Stack } from '@mui/material';
import { useApi } from '@hooks/useApi';
import { SchedulesEndpoint } from '@api/endPoints';
import { SchedulesFromApi } from 'src/types/schedule.types';

interface SchedulesProps {
  showPrintButton?: boolean;
  printTitle?: string;
  compactMode?: boolean;
}

export const Schedules: React.FC<SchedulesProps> = ({
  showPrintButton = true,
  printTitle = 'Графики дежурств и проведения проверок Гродненской ТЭЦ-2',
  compactMode = false, // по умолчанию выключен
}) => {
  const { data, loading, error, refetch } = useApi<SchedulesFromApi>(
    SchedulesEndpoint,
    { method: 'GET' },
    { autoLoad: true }
  );

  const schedules = data?.data || [];

  return (
    <LoadingErrorWrapper
      isLoading={loading}
      error={error}
      onRetry={refetch}
      collectionLength={schedules.length}
      collectionTitle=" графиков дежурств"
      showPrintButton={showPrintButton}
      printDocumentTitle={printTitle}
    >
      <Stack
        spacing={compactMode ? 1 : 3}
        direction={compactMode ? 'row' : 'column'}
      >
        {schedules.map((item) => (
          <Schedule key={item._id} schedule={item} compactMode={compactMode} />
        ))}
      </Stack>
    </LoadingErrorWrapper>
  );
};
