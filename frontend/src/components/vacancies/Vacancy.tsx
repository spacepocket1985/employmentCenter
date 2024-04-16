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
import { Link } from 'react-router-dom';

type VacancyItemProps = {
  vacancy: VacancyType;
  vacancyStyle?:React.CSSProperties;
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
    <ListItem style={{ borderBottom: '1px solid grey',...props.vacancyStyle }}>
      <ListItemAvatar>
        <Avatar style={{ backgroundColor: '#1976d2' }}>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <Link to={`/vacancy/${props.vacancy._id!}`} style={{ textDecoration: 'none', color:'#000' }}>
      <ListItemText
        primary={vacancy.title}
        secondary={`Зарплата: ${vacancy.salary}. Ставка: ${vacancy.wageRate}. Образование: ${vacancy.education} Опыт работы: ${vacancy.experience}.`}
      /></Link>
      {user && (
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
      )}
    </ListItem>
  );
};
