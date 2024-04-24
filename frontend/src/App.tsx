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
