import { Box, Grid, List } from '@mui/material';
import { Vacancy } from './Vacancy';
import { FormAddVacancy } from './FormAddVacancy';
import { useAppSelector } from '../../hooks/storeHooks';
import { VacancyType } from '../../types/types';

const VacancyList: React.FC<{ vacancies: VacancyType[] }> = ({ vacancies }) => {
  const user = useAppSelector((state) => state.user.name);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Grid container style={{ padding: '10px' }}>
        {user && <FormAddVacancy />}
      </Grid>
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
