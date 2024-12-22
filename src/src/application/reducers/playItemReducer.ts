import { createSlice } from '@reduxjs/toolkit';
import { loadPlayItems } from '../actions/playItemActions';
import { NewPlayItem } from '../../domain/entities/NewPlayItem';

export interface PlayItemState {
  items: NewPlayItem[];
  loading: boolean;
  error: string | null;
}

export interface PlayItemRootState {
    playItems: PlayItemState;
  }

const initialState: PlayItemState = {
  items: [],
  loading: false,
  error: null,
};

const playItemSlice = createSlice({
  name: 'playItems',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPlayItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPlayItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadPlayItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching play items';
      });
  },
});

export default playItemSlice.reducer;