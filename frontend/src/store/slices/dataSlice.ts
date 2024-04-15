import { createSlice } from '@reduxjs/toolkit';

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
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
});

export default dataSlice.reducer;
