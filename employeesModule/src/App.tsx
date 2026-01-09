import { useEffect, useState } from 'react';

import { getEmployeeTodayBirthdays } from './utils/employeeService';
import { EmployeeType } from './types/types';
import { EmployeesList } from './components/employees';

const App: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  useEffect(() => {
    const getAsyncData = async () => {
      const data = await getEmployeeTodayBirthdays();
      if (data) setEmployees(data);
    };
    getAsyncData();
  }, []);
  return <EmployeesList employees={employees || []} />;
};

export default App;
