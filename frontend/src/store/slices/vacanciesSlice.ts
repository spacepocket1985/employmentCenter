import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { VacancyInfoFromDBType, VacancyType } from '../../types/types';
import { infoActions } from './infoSlice';

export type VacanciesStateType = {
  vacancies: VacancyType[];
};

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
    addNewVacancy: (state, action: PayloadAction<VacancyType>) => {
      state.vacancies = [
        {
          title: action.payload.title,
          salary: action.payload.salary,
          education: action.payload.education,
          wageRate: action.payload.wageRate,
          experience: action.payload.experience,
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
    builder.addCase(deleteVacancyFromDB.fulfilled, (state, action) => {
      if (action.payload) {
        state.vacancies = state.vacancies.filter((vanancy) => {
          return vanancy._id !== action.payload._id;
        });
      }
    });
  },
});

const handleAsyncThunk = async (
  params: AsyncThunkParams,
  thunkAPI: {
    dispatch: (action: unknown) => void;
  }
): Promise<VacancyType | VacancyType[]> => {
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

    const responseData: VacancyInfoFromDBType = await response.json();

    thunkAPI.dispatch(infoActions.clearError());
    thunkAPI.dispatch(infoActions.setSuccess(params.successMessage));
    console.log(responseData)
    return responseData.vacancies;
  } catch (error) {
    if (error instanceof Error) {
      thunkAPI.dispatch(infoActions.setError(params.errorMessage));
    }
    return [];
  }
};

export const getAllVacanciesFromDB = createAsyncThunk(
  'vacancies/getvacancies',
  async (_, thunkAPI) => {
    return handleAsyncThunk(
      {
        url: 'http://localhost:5000/vacancies',
        method: 'GET',
        successMessage: 'Вакансии успешно загружены',
        errorMessage: 'Ошибка при получении вакансий',
      },
      thunkAPI
    ) as Promise<VacancyType[]>;
  }
);

export const addNewVacancyToDB = createAsyncThunk(
  'vacancies/addNewVacancy',
  async (vacancy: VacancyType, thunkAPI) => {
    return handleAsyncThunk(
      {
        url: 'http://localhost:5000/vacancies',
        method: 'POST',
        body: vacancy,
        successMessage: 'Вакансия успешно добавлена',
        errorMessage: 'Ошибка при добавлении вакансии',
      },
      thunkAPI
    ) as Promise<VacancyType>;
  }
);

export const deleteVacancyFromDB = createAsyncThunk(
  'vacancies/deleteVacancy',
  async (id: string, thunkAPI) => {
    return handleAsyncThunk(
      {
        url: `http://localhost:5000/vacancies/${id}`,
        method: 'DELETE',
        successMessage: 'Вакансия успешно удалена',
        errorMessage: 'Ошибка при удалении вакансии',
      },
      thunkAPI
    ) as Promise<VacancyType>;
  }
);

export const updateVacancyFromDB = createAsyncThunk(
  'vacancies/updateVacancy',
  async (vacancy: VacancyType, thunkAPI) => {
    return handleAsyncThunk(
      {
        url: `http://localhost:5000/vacancies/${vacancy._id}`,
        method: 'PATCH',
        body: {
          title: vacancy.title,
          wageRate: vacancy.wageRate,
          education: vacancy.education,
          experience: vacancy.experience,
          salary: vacancy.salary,
        },
        successMessage: 'Вакансия успешно обновлена',
        errorMessage: 'Ошибка при обновлении вакансии',
      },
      thunkAPI
    ) as Promise<VacancyType>;
  }
);

export const vacanciesActions = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
