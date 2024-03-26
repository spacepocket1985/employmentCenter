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
  getAllVacanciesFromDB,
} from '../../store/slices/vacanciesSlice';

type VacancyItemProps = {
  vacancy: VacancyType;
};

export const Vacancy = (props: VacancyItemProps): JSX.Element => {
  const { vacancy } = props;
  const dispatch = useAppDispatch();
  const onDeleteClickHandler = async (): Promise<void> => {
    if (vacancy._id) {
      await dispatch(deleteVacancyFromDB(vacancy._id));
      await dispatch(getAllVacanciesFromDB());
    }
  };
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={vacancy.title}
        secondary={`Зарплата: ${vacancy.salary}, Ставка: ${vacancy.wageRate}, Образование: ${vacancy.education}`}
      />
      <IconButton aria-label="delete" onClick={onDeleteClickHandler}>
        <Delete />
      </IconButton>
    </ListItem>
  );
};
