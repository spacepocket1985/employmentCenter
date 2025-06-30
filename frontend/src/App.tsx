import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';

import { Advantages } from '@components/advantages';
import { Footer, Header } from '@components/layout';
import { AppRouter } from '@routes/AppRouter';

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
