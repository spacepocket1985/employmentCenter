import React, { useState } from 'react';
import { Avatar, Stack, Typography, Divider, TextField } from '@mui/material';
import { EmployeeType } from '../../types/types';
import { transformBD } from '../../utils/transformBD';

import CakeIcon from '@mui/icons-material/Cake';


export const Employee: React.FC<{ employee: EmployeeType }> = React.memo(
  ({ employee }) => {
    const [date, setDate] = useState<string>('');
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDate = e.target.value ? e.target.value : '';
      setDate(newDate);
    };

    return (
      <Stack
        spacing={1}
        divider={<Divider orientation="horizontal" flexItem />}
      >
        <Stack direction={'row'} alignItems="center" spacing={1}>
          <Avatar sx={{ width: 32, height: 32, backgroundColor: '#1976d2' }}>
            <CakeIcon sx={{ width: 20, height: 20 }} />
          </Avatar>
          <Typography variant='subtitle1'>
            {transformBD(employee.birthday)}
          </Typography>
        </Stack>
        <Typography
          textAlign={'left'}
        >{`${employee.name} ${employee.job}, ${employee.department}.`}</Typography>
        {
          <TextField
            type="date"
            label="Выберите дату"
            value={date ? date.split('T')[0] : ''}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
          />
        }
      </Stack>
    );
  }
);
