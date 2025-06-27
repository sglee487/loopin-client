import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sort: 'title' | 'recent';
  filterText: string;
}
const initialState: UIState = { sort: 'recent', filterText: '' };

const playlistsSlice = createSlice({
  name: 'playlistsUI',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<UIState['sort']>) {
      state.sort = action.payload;
    },
    setFilterText(state, action: PayloadAction<string>) {
      state.filterText = action.payload;
    },
  },
});

export const { setSort, setFilterText } = playlistsSlice.actions;
export default playlistsSlice.reducer;
