import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { VacancyInfoFromDBType, VacancyType } from '../../types/types';
import { errorActions } from './errorSlice';

export type VacanciesStateType = {
  vacancies: VacancyType[];
};

const initialState: VacanciesStateType = {
  vacancies: [],
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    addNewVacancy: (state, action: PayloadAction<VacancyType>) => {
      state.vacancies = [
        {
          title: action.payload.title,
          salary: action.payload.salary,
          education: action.payload.education,
          wageRate: action.payload.wageRate,
        },
        ...state.vacancies,
      ];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllVacanciesFromDB.fulfilled, (state, action) => {
      if (action.payload) {
        state.vacancies = action.payload;
      }
    });
    builder.addCase(addNewVacancyToDB.fulfilled, (state, action) => {
      if (action.payload) {
        state.vacancies.push(action.payload);
      }
    });
    builder.addCase(updateVacancyFromDB.fulfilled, (state, action) => {
      if (action.payload) {
        const vacancyIdForChange = state.vacancies.findIndex(
          (item) => item._id === action.payload?._id
        );
        state.vacancies[vacancyIdForChange] = action.payload;
      }
    });
  },
});

export const getAllVacanciesFromDB = createAsyncThunk(
  'vacancies/getvacancies',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/vacancies');
      if (!response.ok) throw new Error('Ошибка при получении вакансий');

      const responseData: VacancyInfoFromDBType = await response.json();
      if (!responseData) return [];

      return responseData.vacancies as VacancyType[];
    } catch (error) {
      if (error instanceof Error) {
        thunkAPI.dispatch(
          errorActions.setError('Ошибка при получении вакансий')
        );
      }
    }
  }
);

export const addNewVacancyToDB = createAsyncThunk(
  'vacancies/addNewVacancy',
  async (vacancy: VacancyType, thunkAPI) => {
    try {
      const response = await fetch('http://localhost:5000/vacancies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacancy),
      });

      if (!response.ok) {
        throw new Error('Ошибка при добавлении вакансии');
      }

      const responseData: VacancyInfoFromDBType = await response.json();
      return responseData.vacancies as VacancyType;
    } catch (error) {
      if (error instanceof Error) {
        thunkAPI.dispatch(
          errorActions.setError('Ошибка при добавлении вакансии')
        );
      }
    }
  }
);

export const deleteVacancyFromDB = createAsyncThunk(
  'vacancies/deleteVacancy',
  async (id: string, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:5000/vacancies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении вакансии');
      }

      const responseData: VacancyInfoFromDBType = await response.json();

      return responseData.vacancies as VacancyType[];
    } catch (error) {
      if (error instanceof Error) {
        thunkAPI.dispatch(
          errorActions.setError('Ошибка при удалении вакансии')
        );
      }
    }
  }
);

export const updateVacancyFromDB = createAsyncThunk(
  'vacancies/updateVacancy',
  async (vacancy: VacancyType, thunkAPI) => {
    try {
      const response = await fetch(
        `http://localhost:5000/vacancies/${vacancy._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: vacancy.title,
            wageRate: vacancy.wageRate,
            education: vacancy.education,
            salary: vacancy.salary,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Ошибка при обновлении вакансии');
      }

      const responseData: VacancyInfoFromDBType = await response.json();

      return responseData.vacancies as VacancyType;
    } catch (error) {
      if (error instanceof Error) {
        thunkAPI.dispatch(
          errorActions.setError('Ошибка при обновлении вакансии')
        );
      }
    }
  }
);

export const vacanciesActions = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
