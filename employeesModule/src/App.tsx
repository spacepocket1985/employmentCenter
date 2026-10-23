import React from 'react';

import { EmployeesList } from './components/employees';
import { todayBirthdaysEndpoint } from './api/endPoints';
import { useApi } from './hooks/useApi';
import { EmployeesApiResponse, EmployeeType } from './types/employee.types';

const App: React.FC = () => {
  const { data } = useApi<EmployeesApiResponse>(todayBirthdaysEndpoint);

  const employees: EmployeeType[] = data?.data ?? [];

  return <EmployeesList employees={employees} />;
};

export default App;
