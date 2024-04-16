import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Grid } from '@mui/material';

import { useAppDispatch, useAppSelector } from './hooks/storeHooks';

import { Header } from './components/layout/Header';
import { getAllVacanciesFromDB } from './store/slices/vacanciesSlice';
import VacancyList from './components/vacancies/VacancyList';
import { Advantages } from './components/advantages/Advantages';
import { FormAddVacancy } from './components/vacancies/FormAddVacancy';
import { Footer } from './components/layout/Footer';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from './components/spinner/Spinner';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);
  const isLoading = useAppSelector((state) => state.info.loading);

  useEffect(() => {
    const fetchVacancies = async () => {
      dispatch(getAllVacanciesFromDB());
    };

    fetchVacancies();
  }, [dispatch]);

  const { successMessage, errorMessage } = useAppSelector(
    (state) => state.info
  );

  useEffect(() => {
    if (successMessage)
      toast.info(successMessage, { position: 'top-left', autoClose: 2000 });
    if (errorMessage)
      toast.error(errorMessage, { position: 'top-left', autoClose: 2000 });
  }, [successMessage, errorMessage]);

  return (
    <>
      <Header />
      <Grid container style={{ padding: '20px' }}>
        {user && <FormAddVacancy />}
        {isLoading && <Spinner />}
      </Grid>
      <Advantages />
      <VacancyList />
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;
