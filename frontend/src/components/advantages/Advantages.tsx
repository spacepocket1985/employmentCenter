import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import HolidayVillageRoundedIcon from '@mui/icons-material/HolidayVillageRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

import { UIModal } from '../ui/UIModal';

const advantagesData = [
  { title: 'Достойная заработная плата', icon: PaidRoundedIcon },
  {
    title: 'Дополнительные выплаты к государственным праздникам',
    icon: SavingsRoundedIcon,
  },
  {
    title: 'Возможность обучения и профессионального развития',
    icon: SchoolRoundedIcon,
  },
  {
    title: 'Наличие медицинского страхования',
    icon: LocalHospitalRoundedIcon,
  },
  {
    title: 'Возможность льготного оздоровления в санатории «Энергетик»',
    icon: HolidayVillageRoundedIcon,
  },
  { title: 'Наличие столовй и буфета', icon: RestaurantMenuRoundedIcon },
  {
    title: 'Дружелюбная и поддерживающая рабочая атмосфера',
    icon: PeopleRoundedIcon,
  },
];

export const Advantages = () => {
  

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
