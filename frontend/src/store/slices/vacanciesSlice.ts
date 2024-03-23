import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { VacancyInfoFromDBType, VacancyType } from '../../types/types';

export type VacanciesStateType = {
  vacancies: VacancyType[];
};

const initialState: VacanciesStateType = {
  vacancies: [],
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllVacanciesFromDB.fulfilled, (state, action) => {
      if (action.payload) {
        state.vacancies = action.payload;
      }
    });
  },
});

export const getAllVacanciesFromDB = createAsyncThunk(
  'vacancies/getDataFromCart',
  async (_, thunkApi) => {
    try {
      const response = await fetch('http://localhost:5000/vacancies');
      if (!response.ok) throw new Error('Ошибка про получении  данных корзины');

      const responseData: VacancyInfoFromDBType = await response.json();
      if (!responseData) return [];

      return responseData.vacancies;
    } catch (error) {
      if (error instanceof Error) {
        //   thunkApi.dispatch(
        //     mainActions.showStatusMessage({
        //       status: 'error',
        //       title: 'Ошибка при получении данных корзины',
        //       message: error.message,
        //     })
        //   );
      }
    }
  }
);

export const cartActions = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
