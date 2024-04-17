import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { Vacancy } from '../components/vacancies/Vacancy';
import { useAppSelector } from '../hooks/storeHooks';
import { RoutePaths } from '../routes/routePaths';

export const VacancyPage = (): JSX.Element => {
  const { vacancies } = useAppSelector((state) => state.vacancies);
  const { vacancyId } = useParams();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(RoutePaths.HOME);
  };

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
        <Vacancy
          vacancy={requestedVacancy}
          vacancyStyle={{ borderBottom: 'none' }}
          key={requestedVacancy._id}
        />
        <ListItem>
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
        <ListItem>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: '#1976d2' }}>
              <ReceiptLongRoundedIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={'Заработная плата указана до вычета налогов.'}
          />
        </ListItem>
      </List>
      <IconButton
        onClick={handleClick}
        style={{
          borderRadius: '10px',
          color: '#fff',
          backgroundColor: '#1976d2',
        }}
      >
        <FormatListBulletedRoundedIcon
          style={{ color: '#fff', marginRight: '5px' }}
        />
        <Typography variant="subtitle2" component="span">
          {'Вернуться к списку вакансий'}
        </Typography>
      </IconButton>
    </Box>
  );
};
