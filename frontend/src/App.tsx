import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

import { Header } from './components/layout/Header';
import { Advantages } from './components/advantages/Advantages';
import { Footer } from './components/layout/Footer';
import { AppRouter } from './routes/AppRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';



const App = (): JSX.Element => {

  return (
    <Router>
      <Header />
      <Advantages />
      <Footer />
      <ToastContainer />
      <AppRouter />
    </Router>
  );
};

export default App;
