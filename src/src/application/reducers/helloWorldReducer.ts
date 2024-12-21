import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
};

const helloWorldSlice = createSlice({
  name: 'helloWorld',
  initialState,
  reducers: {
    setMessage(state, action) {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = helloWorldSlice.actions;

export default helloWorldSlice.reducer;
