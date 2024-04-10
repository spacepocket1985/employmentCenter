import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/storeHooks';

import './App.css';
import { Header } from './components/layout/Header';
import { getAllVacanciesFromDB } from './store/slices/vacanciesSlice';
import VacancyList from './components/vacancies/VacancyList';
import { FormAddVacancy } from './components/vacancies/FormAddVacancy';
import { Grid } from '@mui/material';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);

  useEffect(() => {
    const fetchVacancies = async () => {
      dispatch(getAllVacanciesFromDB());
    };

    fetchVacancies();
  }, [dispatch]);

  return (
    <>
      <Header />
      <Grid container style={{ padding: '20px' }}>
        {user && <FormAddVacancy />}
      </Grid>
      <VacancyList />
    </>
  );
};

export default App;
