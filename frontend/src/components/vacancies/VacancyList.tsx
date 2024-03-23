import { Box, List } from '@mui/material';

import { useAppSelector } from '../../hooks/storeHooks';
import { Vacancy } from './Vacancy';

const VacancyList = (): JSX.Element => {
  const vacancies = useAppSelector((state) => state.vacancies.vacancies);
  return (
    <Box display="flex" justifyContent="center">
      <List>
        {vacancies.length === 0 ? (
          <h2>We dont have vacancies, yet</h2>
        ) : (
          vacancies.map((vacancy, index) => (
            <Vacancy key={index} vacancy={vacancy} />
          ))
        )}
      </List>
    </Box>
  );
};

export default VacancyList;
