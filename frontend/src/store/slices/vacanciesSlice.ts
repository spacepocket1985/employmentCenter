import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { InfoFromDBType, VacancyType } from '../../types/types';
import { infoActions } from './infoSlice';

export type VacanciesStateType = {
  vacancies: VacancyType[];
};

export const serverEndPoint = 'http://10.182.1.143:5000';

type AsyncThunkParams = {
  url: string;
  method: string;
  body?: object;
  successMessage: string;
  errorMessage: string;
};

const initialState: VacanciesStateType = {
  vacancies: [],
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
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
    builder.addCase(deleteVacancyFromDB.fulfilled, (state, action) => {
      if (action.payload) {
        state.vacancies = state.vacancies.filter((vanancy) => {
          return vanancy._id !== action.payload._id;
        });
      }
    });
  },
});

export const handleAsyncThunk = async <T>(
  params: AsyncThunkParams,
  thunkAPI: {
    dispatch: (action: unknown) => void;
  }
): Promise<T> => {
  try {
    const response = await fetch(params.url, {
      method: params.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: params.body ? JSON.stringify(params.body) : undefined,
    });

    if (!response.ok) {
      throw new Error(params.errorMessage);
    }

    const responseData: InfoFromDBType<T> = await response.json();

    thunkAPI.dispatch(infoActions.clearError());
    thunkAPI.dispatch(infoActions.setSuccess(params.successMessage));
    thunkAPI.dispatch(infoActions.setLoading(false));

    return responseData.data;
  } catch (error) {
    if (error instanceof Error) {
      thunkAPI.dispatch(infoActions.setError(params.errorMessage));
    }
    return [] as T;
  }
};

export const getAllVacanciesFromDB = createAsyncThunk(
  'vacancies/getvacancies',
  async (_, thunkAPI) => {
    return handleAsyncThunk<VacancyType[]>(
      {
        url: `${serverEndPoint}/vacancies`,
        method: 'GET',
        successMessage: 'Вакансии успешно загружены',
        errorMessage: 'Ошибка при получении вакансий',
      },
      thunkAPI
    );
  }
);

export const addNewVacancyToDB = createAsyncThunk(
  'vacancies/addNewVacancy',
  async (vacancy: VacancyType, thunkAPI) => {
    return handleAsyncThunk<VacancyType>(
      {
        url: `${serverEndPoint}/vacancies`,
        method: 'POST',
        body: vacancy,
        successMessage: 'Вакансия успешно добавлена',
        errorMessage: 'Ошибка при добавлении вакансии',
      },
      thunkAPI
    );
  }
);

export const deleteVacancyFromDB = createAsyncThunk(
  'vacancies/deleteVacancy',
  async (id: string, thunkAPI) => {
    return handleAsyncThunk<VacancyType>(
      {
        url: `${serverEndPoint}/vacancies/${id}`,
        method: 'DELETE',
        successMessage: 'Вакансия успешно удалена',
        errorMessage: 'Ошибка при удалении вакансии',
      },
      thunkAPI
    );
  }
);
export const updateVacancyFromDB = createAsyncThunk(
  'vacancies/updateVacancy',
  async (vacancy: VacancyType, thunkAPI) => {
    return handleAsyncThunk<VacancyType>(
      {
        url: `${serverEndPoint}/vacancies/${vacancy._id}`,
        method: 'PATCH',
        body: {
          title: vacancy.title,
          wageRate: vacancy.wageRate,
          education: vacancy.education,
          experience: vacancy.experience,
          salary: vacancy.salary,
          additionalInformation: vacancy.additionalInformation
          
        },
        successMessage: 'Вакансия успешно обновлена',
        errorMessage: 'Ошибка при обновлении вакансии',
      },
      thunkAPI
    );
  }
);

export const vacanciesActions = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
