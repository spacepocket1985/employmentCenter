import { Box, List } from '@mui/material';

import { useAppSelector } from '../../hooks/storeHooks';
import { Vacancy } from './Vacancy';

const VacancyList = (): JSX.Element => {
  const vacancies = useAppSelector((state) => state.vacancies.vacancies);
  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexDirection='column'>
      <List>
        {vacancies.length === 0 ? (
          <h2>В данный момент у нас нет свободный вакансий.</h2>
        ) : (
          vacancies.map((vacancy) => (
            <Vacancy key={vacancy._id} vacancy={vacancy} />
          ))
        )}
      </List>
    </Box>
  );
};

export default VacancyList;
