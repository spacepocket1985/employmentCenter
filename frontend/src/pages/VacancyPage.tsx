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
import { RoutePaths } from '../routes/routePaths';
import { useGetVacancyQuery } from '../store/slices/vacanciesApiSlice';

export const VacancyPage = (): JSX.Element => {
  const { vacancyId } = useParams();
  const navigate = useNavigate();

  const { data: results} = useGetVacancyQuery(vacancyId!);

  if (!results) return <h4>Запрашиваемая вакансия не найдена</h4>;

  const handleClick = () => {
    navigate(RoutePaths.HOME);
  };

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
          vacancy={results.data}
          vacancyStyle={{ borderBottom: 'none' }}
          key={results.data._id}
        />
        <ListItem>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: '#1976d2' }}>
              <InfoRoundedIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={'Дополнительные информация'}
            secondary={results.data.additionalInformation}
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
