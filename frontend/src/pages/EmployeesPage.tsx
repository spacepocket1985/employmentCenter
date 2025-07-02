import {
  EmployeeSearch,
  EmployeesList,
  FormEditEmployee,
} from '@components/employees';
import { Spinner } from '@components/spinner';
import { Box, Container } from '@mui/material';

import { useGetEmployeeTodayBirthdaysQuery } from '@store/slices';

const EmployeesPage = (): JSX.Element => {
  const {
    data: results,
    isFetching,
    isError,
  } = useGetEmployeeTodayBirthdaysQuery();

  const error = isError ? (
    <h2>{`Ошибка при загрузке данных. ${results?.msg}`}</h2>
  ) : null;

  const contentOrSpinner = isFetching ? (
    <Spinner />
  ) : (
    <Box display={'flex'} gap={2} flexDirection={'column'}>
      <FormEditEmployee />
      <Box display={'flex'} alignItems={'flex-start'} justifyContent={'space-between'}>
        <EmployeeSearch />
        <EmployeesList
          employees={results?.data || []}
          listTitle="Ближайшие дни рождения"
        />
      </Box>
    </Box>
  );

  return (
    <>
      <Container
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {isError ? error : contentOrSpinner}
      </Container>
    </>
  );
};

export default EmployeesPage;
