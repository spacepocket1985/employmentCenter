import React, { useState } from 'react';

import { Box, Button, Card, Typography } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { transformBD } from '../../utils/transformBD';
import { EmployeeCard } from './EmployeeCard';
import { BirthdaysDialog } from './BirthdaysDialog';
import { EmployeeType } from '../../types/employee.types';

export const EmployeesList: React.FC<{
  employees: EmployeeType[];
  showBirthdaysButton?: boolean;
}> = ({ employees, showBirthdaysButton = true }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

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
          width: '100%',
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
        {employees.map((employee, index) => {
          // В виджете /hb подсвечиваем ТОЛЬКО «сегодня».
          // «Скоро» (завтра/послезавтра) — нейтральное, чтобы не шуметь в компактном списке.
          const { isToday } = transformBD(employee.birthday);

          return (
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
                <EmployeeCard
                  employee={employee}
                  isToday={isToday}
                  isSoon={false}
                />
              </Card>
            </React.Fragment>
          );
        })}

        {showBirthdaysButton && (
          <Button
  fullWidth
  onClick={() => setIsDialogOpen(true)}
  startIcon={<CelebrationIcon />}
  sx={{
    mt: 1,
    mb: 1,
    backgroundColor: '#103896',
    color: 'white',
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: '5px',
    padding: '0.5rem 1rem',
    justifyContent: 'flex-start',
    '& .MuiButton-startIcon': {
      marginRight: '12px',
    },
    '&:hover': {
      backgroundColor: '#0d2e7a',
    },
  }}
>
  Посмотреть все дни рождения
</Button>
        )}
      </Box>

      <BirthdaysDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  );
};
