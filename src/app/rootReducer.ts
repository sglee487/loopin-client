import { combineReducers } from '@reduxjs/toolkit';
import playlistsSlice from '@/features/playlists/playlistsSlice';

export default combineReducers({
  playlists: playlistsSlice,
});
