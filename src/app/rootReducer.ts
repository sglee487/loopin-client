import { combineReducers } from '@reduxjs/toolkit';
import playlistsSlice from '@/features/playlists/playlistsSlice';
import playerSlice from '@/features/player/playerSlice';

export default combineReducers({
  playlists: playlistsSlice,
  player: playerSlice,
});
