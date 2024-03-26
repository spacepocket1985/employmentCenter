import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  education: [
    'общее среднее',
    'профессионально-техническое',
    'среднее специальное',
    'высшее',
    'научно-ориентированное',
  ],
};

export const dataSlice = createSlice({
    name: 'data',
    initialState,
    reducers: {},
  });
  
  export default dataSlice.reducer;
