import { EmployeesList } from './components/employees/EmployeesList';
import { useGetEmployeeTodayBirthdaysQuery } from './store/slices/apiSlice';

import './App.css';

const App: React.FC = () => {
  const { data: employees } = useGetEmployeeTodayBirthdaysQuery();
  return <EmployeesList employees={employees?.data || []} />;
};

export default App;
