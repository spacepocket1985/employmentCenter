import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleAsyncThunk, serverEndPoint } from './vacanciesSlice';
import { UserType } from '../../types/types';

type UserInfoFromDBType = {
  name: string | null;
  token: string | null;
};

const initialState: UserInfoFromDBType = {
  name: null,
  token: null,
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    logOutUser: (state) => {
      state.name = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      if (action.payload) {
        state.name = action.payload.name;
        state.token = action.payload.token;
      }
    });
  },
});

export const login = createAsyncThunk(
  'user/login',
  async (user: UserType, thunkAPI) => {
    return handleAsyncThunk<UserInfoFromDBType>(
      {
        url: `${serverEndPoint}/auth/login`,
        method: 'POST',
        body: user,
        successMessage: 'Пользователь успешно залогинен',
        errorMessage: 'Ошибка при логине пользователя',
      },
      thunkAPI
    );
  }
);
export const userActions = userSlice.actions;
export default userSlice.reducer;
