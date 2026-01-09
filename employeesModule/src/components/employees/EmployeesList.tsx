import React from 'react';
import { EmployeeType } from '../../types/types';
import { Box, Card, Typography } from '@mui/material';
import { Employee } from './Employee';
import CakeIcon from '@mui/icons-material/Cake';

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
      <Box
        display="flex"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          backgroundColor: '#103896',
          textTransform: 'uppercase',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          width:'100%',
          mb: 1,
          mr: 'auto',
        }}
      >
        <CakeIcon sx={{ mr: 1, color: 'white' }} />
        <Typography
          component="h3"
          variant="body2"
          color={'white'}
          fontWeight={600}
        >
          Дни рождения сотрудников
        </Typography>
      </Box>

      <Box sx={{ width: '100%', maxWidth: 800 }}>
        {employees.map((employee, index) => (
          <React.Fragment key={employee._id}>
            <Card
              variant="outlined"
              sx={{
                mb: 1.2,
                borderRadius: 2,

                bgcolor:
                  index % 2 !== 0 ? 'background.default' : 'action.hover',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-1px)',
                  transition: 'transform 0.2s',
                },
              }}
            >
              <Employee employee={employee} />
            </Card>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};
