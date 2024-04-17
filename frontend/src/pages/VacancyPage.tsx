import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import { useParams } from 'react-router-dom';

import { Vacancy } from '../components/vacancies/Vacancy';
import { useAppSelector } from '../hooks/storeHooks';

export const VacancyPage = (): JSX.Element => {
  const { vacancies } = useAppSelector((state) => state.vacancies);
  const { vacancyId } = useParams();

  const requestedVacancy = vacancies.find((vavancy) => {
    return vavancy._id === vacancyId;
  });

  if (!requestedVacancy) return <h4>Запрашиваемая вакансия не найдена</h4>;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      textAlign={'center'}
    >
      <List>
        <Vacancy vacancy={requestedVacancy} vacancyStyle={{borderBottom: 'none'}} key={requestedVacancy._id}/>
        <ListItem >
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: '#1976d2' }}>
              <InfoRoundedIcon />
            </Avatar>
          </ListItemAvatar>

            <ListItemText
              primary={'Дополнительные информация'}
              secondary={requestedVacancy.additionalInformation}
            />
          
        </ListItem>
      </List>
    </Box>
  );
};
