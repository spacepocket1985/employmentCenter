import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Box,
  List,
  Typography,
} from '@mui/material';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { Link } from 'react-router-dom';

export const AboutPage = (): JSX.Element => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      
    >
      <Link to={`/vacancy`} style={{ textDecoration: 'none', color: '#000' }}>
        <Typography variant="subtitle1" component="p">
          {
            'Данное приложение представляет собой центр занятости предприятия, с возможностью добавления, удаления и редактирования вакансий. Данный проект представляет собой полноценное приложение, разработанное на TypeScript и состоящее из бэкенда и фронтенда.'
          }
        </Typography>{' '}
      </Link>
      <List>
        <ListItem style={{ borderBottom: '1px solid grey' }}>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: '#1976d2' }}>
              <SettingsApplicationsIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={'Бекенд состоявляющая:'}
            secondary={
              'Бэкенд построен на Node.js с использованием Express для обработки HTTP-запросов и Mongoose для взаимодействия с базой данных MongoDB. В нем реализована аутентификация с использованием  JWT для аутентификации на основе токенов. DevDependencies включают инструменты для тестирования, такие как Jest и Supertest, а также TypeScript для проверки типов.'
            }
          />
        </ListItem>
        <ListItem style={{ borderBottom: '1px solid grey' }}>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: '#1976d2' }}>
              <SettingsApplicationsIcon />
            </Avatar>
          </ListItemAvatar>

          <ListItemText
            primary={'Фронтенд состоявляющая:'}
            secondary={
              'Фронтенд разработан с использованием React и использует Redux для управления состоянием. Для стилизации компонентов используется Material-UI, а для навигации - React Router. Валидация форм реализована с помощью Yup и React Hook Form. В проект также включены различные зависимости для линтинга, форматирования и проверки типов с использованием TypeScript.'
            }
          />
        </ListItem>
      </List>
    </Box>
  );
};
