import React from 'react';
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
import { useAppSelector } from '../../hooks/storeHooks';

import { UIModal } from '../ui/UIModal';

import {
  handleSucssestResult,
  handleError,
} from '../../utils/handleRequestResult';

export const Employee: React.FC<{ employee: EmployeeType }> = React.memo(
  ({ employee }) => {
    // const [deleteVacancy] = useDeleteVacancyMutation();

    const user = useAppSelector((state) => state.user.name);

    // const onDeleteClickHandler = useCallback(async () => {
    //   if (vacancy._id) {
    //     await deleteVacancy(vacancy._id)
    //       .unwrap()
    //       .then(handleSucssestResult)
    //       .catch(handleError);
    //   }
    // }, [deleteVacancy, vacancy._id]);

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

        {/* {user && (
          <>
            <UIModal iconType="edit">
              {(handleClose) => (
                <>
                  <FormAddVacancy
                    isEditMode={true}
                    vacancy={vacancy}
                    handleClose={handleClose}
                  />
                </>
              )}
            </UIModal>
            <IconButton aria-label="delete" onClick={onDeleteClickHandler}>
              <Delete style={{ color: '#1976d2' }} />
            </IconButton>
          </>
        )} */}
      </ListItem>
    );
  }
);
