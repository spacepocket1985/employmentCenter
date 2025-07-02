import React from 'react';
import { EmployeeType } from '../../types/types';
import { useAppSelector } from '../../hooks/storeHooks';
import { Box, List } from '@mui/material';
import { Employee } from './Employee';

import { UITitle } from '@components/ui';
import { Spinner } from '@components/spinner';

export const EmployeesList: React.FC<{
  employees: EmployeeType[];
  listTitle: string;
  isFetching?: boolean;
}> = ({ employees, listTitle, isFetching }) => {
  const user = useAppSelector((state) => state.user.name);
  if (!user) return;
  if (isFetching) return <Spinner />;
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <List>
        <UITitle>{employees.length === 0 ? 'Список пуст!' : listTitle}</UITitle>
        {employees.map((employee) => (
          <Employee key={employee._id} employee={employee} />
        ))}
      </List>
    </Box>
  );
};
