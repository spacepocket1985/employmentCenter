import React from 'react';
import { EmployeeType } from '../../types/types';
import { Box } from '@mui/material';
import { Employee } from './Employee';

export const EmployeesList: React.FC<{ employees: EmployeeType[] }> = ({
  employees,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Box>
        {employees.length === 0 ? (
          <h2>Список персонала пуст!</h2>
        ) : (
          employees.map((employee) => (
            <Employee key={employee._id} employee={employee} />
          ))
        )}
      </Box>
    </Box>
  );
};
