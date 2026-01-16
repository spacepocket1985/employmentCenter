import React from 'react';

import { Link } from 'react-router-dom';
import { RoutePaths } from '@routes/routePaths';

import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import {
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@mui/material';
import { ControlItem, UserRole, getUserRole } from 'src/types/user.types';

export const controlsConfig: ControlItem[] = [
  {
    text: 'Дни рождения сотрудников',
    icon: CakeIcon,
    link: RoutePaths.EMPLOYEES,
    roles: [UserRole.ADMIN, UserRole.OKIPR],
  },
  {
    text: 'Список вакансий',
    icon: WorkIcon,
    link: RoutePaths.VACANCYLIST,
    roles: [UserRole.ADMIN, UserRole.OKIPR],
  },
  {
    text: 'Меню',
    icon: RestaurantIcon,
    link: RoutePaths.MENU,
    roles: [UserRole.ADMIN, UserRole.COP],
  },
  {
    text: 'План работ',
    icon: CalendarMonthIcon,
    link: RoutePaths.PLAN,
    roles: [UserRole.ADMIN],
  },
];

interface RoleBasedControlsProps {
  userName: string | null;
  renderAs?: 'list' | 'icons'; // Вариант рендеринга
  onItemClick?: () => void; // Коллбэк для клика (например, закрытие меню)
}

export const RoleBasedControls: React.FC<RoleBasedControlsProps> = ({
  userName,
  renderAs = 'list',
  onItemClick,
}) => {
  const userRole = getUserRole(userName);

  if (!userRole) return null;

  // Фильтруем контролы по роли пользователя
  const filteredControls = controlsConfig.filter((control) =>
    control.roles.includes(userRole)
  );

  if (renderAs === 'icons') {
    return (
      <>
        {filteredControls.map((item, index) => (
          <IconButton
            key={index}
            component={Link}
            to={item.link}
            onClick={onItemClick}
            style={{
              borderRadius: '10px',
              backgroundColor: '#fff',
              marginRight: '5px',
            }}
            title={item.text}
          >
            <item.icon color="primary" />
          </IconButton>
        ))}
      </>
    );
  }

  // Рендеринг как список (для AboutPage)
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {filteredControls.map((item, index) => (
        <ListItem
          key={index}
          component={Link}
          to={item.link}
          onClick={onItemClick}
        >
          <ListItemAvatar sx={{ mr: 1 }}>
            <Avatar sx={{ bgcolor: '#a399ec2b', width: 54, height: 54 }}>
              <item.icon color="primary" sx={{ width: 34, height: 34 }} />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );
};
