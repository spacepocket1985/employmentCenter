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
import { useAppDispatch } from '../../hooks/storeHooks';
import {
  deleteVacancyFromDB,
} from '../../store/slices/vacanciesSlice';

import { UIModal } from '../ui/UIModal';
import { FormAddVacancy } from './FormAddVacancy';

type VacancyItemProps = {
  vacancy: VacancyType;
};

export const Vacancy = (props: VacancyItemProps): JSX.Element => {
  const { vacancy } = props;

  const dispatch = useAppDispatch();

  const onDeleteClickHandler = async (): Promise<void> => {
    if (vacancy._id) {
      await dispatch(deleteVacancyFromDB(vacancy._id));
    }
  };

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: '#1976d2' }}>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={vacancy.title}
        secondary={`Зарплата: ${vacancy.salary}, Ставка: ${vacancy.wageRate}, Образование: ${vacancy.education} Опыт работы: ${vacancy.experience}`}
      />
      <UIModal>
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

      <IconButton aria-label="delete" onClick={onDeleteClickHandler} >
        <Delete style={{ color: '#1976d2' }}/>
      </IconButton>
    </ListItem>
  );
};
