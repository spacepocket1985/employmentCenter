import { Container } from '@mui/material';
import { Spinner } from '../components/spinner/Spinner';

import { useGetAllEmployeesQuery } from '../store/slices/apiSlice';
import { EmployeesList } from '../components/employees/EmployeesList';

export const EmployeesPage = (): JSX.Element => {
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
