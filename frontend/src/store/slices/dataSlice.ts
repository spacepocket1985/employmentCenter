import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  education: [
    '',
    'общее среднее',
    'профессионально-техническое',
    'среднее специальное',
    'высшее',
    'научно-ориентированное',
    'возможность обучения',
    'не имеет значения',
  ],

  experience: [
    '',
    'не имеет значения',
    'без опыта',
    '	от 1 года до 3 лет',
    '	от 3 до 6 лет',
    'более 6 лет',
  ],
  department: [
    '',
    'АУП',
    'КЦ',
    'ТЦ',
    'ЭЦ',
    'ПГТЦ',
    'ЭЦ',
    'ХЦ',
    'ЦТАИ',
    'СППР',
    'ПТО',
    'ОНиОТ',
    'ОКиПР',
    'ПЭО',
    'УБиНУ',
    'ЦОП',
    'ЛНКиТД',
    'ЦТП',
    'ОКС',
  ],
  query: '',
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
  },
});

export default dataSlice.reducer;
export const { setQuery } = dataSlice.actions;
