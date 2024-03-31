import { PayloadAction, createSlice } from '@reduxjs/toolkit';

type infoSliceStateType = {
  successMessage: string | null;
  errorMessage: string | null;
  loading: boolean;
};

const initialState: infoSliceStateType = {
  successMessage: null,
  errorMessage: null,
  loading: false,
};

const infoSlice = createSlice({
  name: 'infoData',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string>) => {
      state.errorMessage = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: () => {
      return initialState;
    },
  },
});

export const infoActions = infoSlice.actions;

export default infoSlice.reducer;
