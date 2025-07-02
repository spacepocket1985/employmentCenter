import React, { useCallback } from 'react';
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';

import { EmployeeType } from '../../types/types';
import { Delete } from '@mui/icons-material';

import { UIModal } from '../ui/UIModal';

import {
  handleSucssestResult,
  handleError,
} from '../../utils/handleRequestResult';
import { useDeleteEmployeeMutation } from '@store/slices';
import { FormEditEmployee } from './FormEditEmployee';

export const Employee: React.FC<{ employee: EmployeeType }> = React.memo(
  ({ employee }) => {
    const [deleteEmployee] = useDeleteEmployeeMutation();

    const onDeleteClickHandler = useCallback(async () => {
      if (employee._id) {
        await deleteEmployee(employee._id)
          .unwrap()
          .then(handleSucssestResult)
          .catch(handleError);
      }
    }, [deleteEmployee, employee._id]);

    return (
      <ListItem style={{ borderBottom: '1px solid grey' }}>
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: '#1976d2' }}>
            <CakeIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={employee.name}
          secondary={`${employee.job}, ${employee.department}. [${employee.birthday}]`}
        />

        <>
          <UIModal iconType="edit">
            {(handleClose) => (
              <>
                <FormEditEmployee
                  isEditMode={true}
                  employee={employee}
                  handleClose={handleClose}
                />
              </>
            )}
          </UIModal>
          <IconButton aria-label="delete" onClick={onDeleteClickHandler}>
            <Delete style={{ color: '#1976d2' }} />
          </IconButton>
        </>
      </ListItem>
    );
  }
);
