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
import DirectionsBusFilledRoundedIcon from '@mui/icons-material/DirectionsBusFilledRounded';
import MapsHomeWorkRoundedIcon from '@mui/icons-material/MapsHomeWorkRounded';

import { UIModal } from '../ui/UIModal';

const advantagesData = [
  {
    title: 'Cвоевременная выплата зарплаты два раза в месяц.',
    icon: PaidRoundedIcon,
  },
  {
    title:
      'Регулярные выплаты к праздникам (8 марта, День независимости, День энергетика, День матери, "овощные").',
    icon: SavingsRoundedIcon,
  },
  {
    title: 'Возможность обучения и профессионального развития.',
    icon: SchoolRoundedIcon,
  },
  {
    title:
      'Хорошие санитарно-бытовые условия, здравпункт, сезонные прививки бесплатно.',
    icon: MapsHomeWorkRoundedIcon,
  },
  {
    title: 'Наличие медицинского страхования.',
    icon: LocalHospitalRoundedIcon,
  },
  {
    title: 'Возможность льготного оздоровления в санатории «Энергетик».',
    icon: HolidayVillageRoundedIcon,
  },
  {
    title: 'Свой цех обшественного питания. Наличие столовй и буфета.',
    icon: RestaurantMenuRoundedIcon,
  },
  {
    title:
      'Доставка к месту работы и обратно заказным транспортом по пяти маршрутам.',
    icon: DirectionsBusFilledRoundedIcon,
  },
  {
    title: 'Дружелюбная и поддерживающая рабочая атмосфера.',
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
      iconLabel="Наши условия и приемущества"
      iconButtonStyle={{
        borderRadius: '10px',
        color: '#fff',
        backgroundColor: '#1976d2',
      }}
      top="40%"
    >
      {() => <List>{renderItems}</List>}
    </UIModal>
  );
};
