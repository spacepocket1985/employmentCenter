import { useAppSelector } from '@hooks/storeHooks';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

import CakeIcon from '@mui/icons-material/Cake';
import WorkIcon from '@mui/icons-material/Work';
import { Link } from 'react-router-dom';
import { RoutePaths } from '@routes/routePaths';

const controlsData = [
  {
    text: 'Дни рождения сотрудников',
    icon: CakeIcon,
    link: RoutePaths.EMPLOYEES,
  },
  {
    text: 'Список вакансий',
    icon: WorkIcon,
    link: RoutePaths.VACANCYLIST,
  },
  {
    text: 'Меню',
    icon: WorkIcon,
    link: RoutePaths.MENU,
  },
];

export const UserControls: React.FC = () => {
  const { name } = useAppSelector((state) => state.user);
  const renderData = controlsData.map((item, index) => (
    <ListItem key={index} component={Link} to={item.link}>
      <ListItemAvatar sx={{ mr: 1 }}>
        <Avatar sx={{ bgcolor: '#a399ec2b', width: 54, height: 54 }}>
          <item.icon color="primary" sx={{ width: 34, height: 34 }} />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={item.text} />
    </ListItem>
  ));
  return (
    <>
      {name && (
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {renderData}
        </List>
      )}
    </>
  );
};
