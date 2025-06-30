import { Container } from '@mui/material';
import { Spinner } from '../components/spinner/Spinner';
import VacancyList from '../components/vacancies/VacancyList';
import { useGetAllVacanciesQuery } from '../store/slices/vacanciesApiSlice';

const VacanciesPage = (): JSX.Element => {
  const { data: results, isFetching, isError } = useGetAllVacanciesQuery();

  const error = isError ? (
    <h2>{`Ошибка при загрузке вакансий. ${results?.msg}`}</h2>
  ) : null;

  const contentOrSpinner = isFetching ? (
    <Spinner />
  ) : (
    <VacancyList vacancies={results?.data || []} />
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

export default VacanciesPage;
