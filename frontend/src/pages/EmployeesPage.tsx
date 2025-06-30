import { EmployeesList } from '@components/employees';
import { Spinner } from '@components/spinner';
import { Container } from '@mui/material';

import { useGetAllEmployeesQuery } from '@store/slices';

const EmployeesPage = (): JSX.Element => {
  const { data: results, isFetching, isError } = useGetAllEmployeesQuery();

  const error = isError ? (
    <h2>{`Ошибка при загрузке данных. ${results?.msg}`}</h2>
  ) : null;

  const contentOrSpinner = isFetching ? (
    <Spinner />
  ) : (
    <EmployeesList employees={results?.data || []} />
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
