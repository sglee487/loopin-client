import { createSlice } from '@reduxjs/toolkit';
import { loadPlaylists } from '@application/actions/playlistActions';
import { Playlist } from '@domain/entities/Playlist';

export interface PlaylistsState {
  playlists: Playlist[];
  loading: boolean;
  error: string | null;
}

export interface PlaylistsRootState {
  playlists: PlaylistsState;
}

const initialState: PlaylistsState = {
  playlists: [],
  loading: false,
  error: null,
};

const playlistsSlice = createSlice({
  name: 'playlists',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadPlaylists.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(loadPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error fetching playlists';
      });
  },
});

export default playlistsSlice.reducer;