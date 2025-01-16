import { Box, Grid, List } from '@mui/material';

import { useGetAllVacanciesQuery } from '../../store/slices/apiSlice';
import { Spinner } from '../spinner/Spinner';
import { Vacancy } from './Vacancy';
import { FormAddVacancy } from './FormAddVacancy';
import { useAppSelector } from '../../hooks/storeHooks';

const VacancyList = (): JSX.Element => {
  const user = useAppSelector((state) => state.user.name);
  const { data: results, isFetching, isError } = useGetAllVacanciesQuery();

  const vacancies = results?.data;

  const spinner = isFetching ? <Spinner /> : null;
  const error = isError ? (
    <h2>{`Ошибка при загрузке вакансий. ${results?.msg}`}</h2>
  ) : null;
  const content = () => {
    return !(isFetching || isError) ? (
      <>
        <Grid container style={{ padding: '10px' }}>
          {user && <FormAddVacancy />}
        </Grid>
        <List>
          {!vacancies ? (
            <h2>В данный момент у нас нет свободный вакансий.</h2>
          ) : (
            vacancies.map((vacancy) => (
              <Vacancy key={vacancy._id} vacancy={vacancy} />
            ))
          )}
        </List>
      </>
    ) : null;
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      {spinner}
      {error}
      {content()}
    </Box>
  );
};

export default VacancyList;
