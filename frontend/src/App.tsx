import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './hooks/storeHooks';

import './App.css';
import { Header } from './components/layout/Header';
import { getAllVacanciesFromDB } from './store/slices/vacanciesSlice';

const App = (): JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchVacancies = async () => {
      await dispatch(getAllVacanciesFromDB());
    };

    fetchVacancies();
  }, [dispatch]);

  const testData = useAppSelector((state) => state.vacancies.vacancies);
  console.log('testData-->  ', testData);

  return (
    <>
      <Header />
    </>
  );
};

export default App;
