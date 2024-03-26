import { createSlice } from '@reduxjs/toolkit';

const initialState = '';

const errorSlice = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action) => {
            return action.payload;
        },
        clearError: () => {
            return initialState;
        },
    },
});

export const errorActions = errorSlice.actions;

export default errorSlice.reducer;
