import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/storeHooks';
import { Grid } from '@mui/material';

import './App.css';
import { Header } from './components/layout/Header';
import { getAllVacanciesFromDB } from './store/slices/vacanciesSlice';
import VacancyList from './components/vacancies/VacancyList';
import { Advantages } from './components/advantages/Advantages';
import { FormAddVacancy } from './components/vacancies/FormAddVacancy';
import { Footer } from './components/layout/Footer';

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
      <Advantages/>
      <VacancyList />
      <Footer/>
    </>
  );
};

export default App;
