import { ToastContainer } from 'react-toastify';
import { Grid } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';

import { useAppSelector } from './hooks/storeHooks';

import { Header } from './components/layout/Header';
import { Advantages } from './components/advantages/Advantages';
import { FormAddVacancy } from './components/vacancies/FormAddVacancy';
import { Footer } from './components/layout/Footer';
import { AppRouter } from './routes/AppRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';


const App = (): JSX.Element => {
  
  const user = useAppSelector((state) => state.user.name);

  // useEffect(() => {
  //   const fetchVacancies = async () => {
  //     dispatch(getAllVacanciesFromDB());
  //   };

  //   fetchVacancies();
  // }, [dispatch]);

  // const { successMessage, errorMessage } = useAppSelector(
  //   (state) => state.info
  // );

  // useEffect(() => {
  //   if (successMessage)
  //     toast.info(successMessage, { position: 'top-left', autoClose: 2000 });
  //   if (errorMessage)
  //     toast.error(errorMessage, { position: 'top-left', autoClose: 2000 });
  // }, [successMessage, errorMessage]);

  return (
    <Router>
      <Header />
      <Grid container style={{ padding: '10px' }}>
        {user && <FormAddVacancy />}
      </Grid>
      <Advantages />
      <Footer />
      <ToastContainer />
      <AppRouter />
    </Router>
  );
};

export default App;
