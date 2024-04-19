import { Box, List } from '@mui/material';
import { useCallback, useEffect } from 'react';

import { useAppSelector } from '../../hooks/storeHooks';

import { useGetAllVacanciesQuery } from '../../store/slices/vacanciesApiSlice';
import { Spinner } from '../spinner/Spinner';
import { Vacancy } from './Vacancy';

const VacancyList = (): JSX.Element => {
  const {
    data: results,
    isFetching,
    isError,
    refetch,
  } = useGetAllVacanciesQuery();

  const isMutation = useAppSelector((state) => state.vacanciesApi.mutations);

  useEffect(() => {
    if (isMutation && !isMutation.isLoading && !isMutation.isError) {
      refetch(); // Повторный запрос списка вакансий после завершения мутации
    }
  }, [isMutation, refetch]);

  const vacancies = results?.data;

  const spinner = isFetching ? <Spinner /> : null;
  const error = isError ? (
    <h2>{`Ошибка при загрузке вакансий. ${results?.msg}`}</h2>
  ) : null;
  const content = useCallback(() => {
    return !(isFetching || isError) ? (
      <List>
        {!vacancies ? (
          <h2>В данный момент у нас нет свободный вакансий.</h2>
        ) : (
          vacancies.map((vacancy) => (
            <Vacancy key={vacancy._id} vacancy={vacancy} />
          ))
        )}
      </List>
    ) : null;
  }, [isFetching, isError, vacancies]);

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
