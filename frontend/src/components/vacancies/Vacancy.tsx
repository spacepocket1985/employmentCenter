import { ListItem, ListItemAvatar, Avatar, ListItemText } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

import { VacancyType } from '../../types/types';

type VacancyItemProps = {
  vacancy: VacancyType;
};

export const Vacancy = (props: VacancyItemProps): JSX.Element => {
  const { vacancy } = props;
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>
          <WorkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={vacancy.title}
        secondary={`Salary: ${vacancy.salary}, Wage-rate: ${vacancy.wageRate}, Education: ${vacancy.education}`}
      />
    </ListItem>
  );
};
