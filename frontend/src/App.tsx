import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRouter } from '@routes/AppRouter';

import './App.css';
import 'react-toastify/dist/ReactToastify.css';

const App = (): JSX.Element => {
  return (
    <Router>
      <ToastContainer />
      <AppRouter />
    </Router>
  );
};

export default App;
