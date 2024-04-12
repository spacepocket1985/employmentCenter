import { createSlice } from '@reduxjs/toolkit';

import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded';
import HolidayVillageRoundedIcon from '@mui/icons-material/HolidayVillageRounded';
import RestaurantMenuRoundedIcon from '@mui/icons-material/RestaurantMenuRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

const initialState = {
  education: [
    '',
    'общее среднее',
    'профессионально-техническое',
    'среднее специальное',
    'высшее',
    'научно-ориентированное',
  ],

  experience: [
    '',
    'не имеет значения',
    'без опыта',
    '	от 1 года до 3 лет',
    '	от 3 до 6 лет',
    'более 6 лет',
  ],
  advantages:  [
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
  ]
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
});

export default dataSlice.reducer;
