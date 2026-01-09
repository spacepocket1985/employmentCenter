import { useEffect, useState } from 'react';
import { VacancyList } from './components/vacancies/VacancyList';
import { getVacancies } from './utils/fetchService';
import { VacancyType } from './types/types';

const App: React.FC = () => {
  const [vacancies, setVacancies] = useState<VacancyType[]>([]);
  useEffect(() => {
    const getAsyncData = async () => {
      const data = await getVacancies();
      if (data) setVacancies(data);
    };
    getAsyncData();
  }, []);
  return <VacancyList vacancies={vacancies || []} />;
};

export default App;
