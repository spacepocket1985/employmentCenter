import { useEffect } from 'react';

import './App.css';
import { Header } from './components/layout/Header';

const App = (): JSX.Element => {
  useEffect(() => {
    fetch('http://localhost:5000/vacancies')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <>
      <Header />
    </>
  );
};

export default App;
