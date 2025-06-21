import { combineReducers } from '@reduxjs/toolkit';
import playlistsSlice from '@/features/playlists/playlistsSlice';

// 기존 store/slices/* 에 있던 다른 slice 들도 모두 import
import authSlice from '@/store/slices/authSlice';

export default combineReducers({
  playlists: playlistsSlice,
  auth: authSlice,
  // ...
});
