import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

import { useAppSelector } from '../../hooks/storeHooks';
import { UIModal } from '../ui/UIModal';

export const Advantages = () => {
  const advantagesData = useAppSelector((state) => state.data.advantages);

  const renderItems = advantagesData.map((item, index) => {
    return (
      <ListItem key={index}>
        <ListItemAvatar>
          <Avatar style={{ backgroundColor: '#1976d2' }}>
            <item.icon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item.title} />
      </ListItem>
    );
  });

  return (
    <UIModal
      iconType="thumbUp"
      iconColor="#1976d2"
      iconLabel="Наши приемущества"
    >
      {() => <List>{renderItems}</List>}
    </UIModal>
  );
};
