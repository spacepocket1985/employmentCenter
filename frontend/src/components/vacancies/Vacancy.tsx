import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

import { VacancyType } from '../../types/types';
import { Delete } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHooks';
import { deleteVacancyFromDB } from '../../store/slices/vacanciesSlice';

import { UIModal } from '../ui/UIModal';
import { FormAddVacancy } from './FormAddVacancy';

type VacancyItemProps = {
  vacancy: VacancyType;
};

export const Vacancy = (props: VacancyItemProps): JSX.Element => {
  const { vacancy } = props;

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.name);

  const onDeleteClickHandler = async (): Promise<void> => {
    if (vacancy._id) {
      dispatch(deleteVacancyFromDB(vacancy._id));
    }
  };

  return (
    <ListItem sx={{ borderBottom: '1px solid grey' }}>
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: '#1976d2' }}>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={vacancy.title}
        secondary={`Зарплата: ${vacancy.salary}, Ставка: ${vacancy.wageRate}, Образование: ${vacancy.education} Опыт работы: ${vacancy.experience}`}
      />
      {user && (
        <>
          <UIModal iconType="edit" iconColor="#1976d2">
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
      )}
    </ListItem>
  );
};
