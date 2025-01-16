import React from 'react';
import { EmployeeType } from '../../types/types';
import { useAppSelector } from '../../hooks/storeHooks';
import { Box, Grid, List } from '@mui/material';
import { Employee } from './Employee';

export const EmployeesList: React.FC<{ employees: EmployeeType[] }> = ({
  employees,
}) => {
  const user = useAppSelector((state) => state.user.name);
  if (!user) return;
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Grid container style={{ padding: '10px' }}>
        {/* {user && <FormAddVacancy />} */}
      </Grid>
      <List>
        {employees.length === 0 ? (
          <h2>Список персонала пуст!</h2>
        ) : (
          employees.map((employee) => (
            <Employee key={employee._id} employee={employee} />
          ))
        )}
      </List>
    </Box>
  );
};
