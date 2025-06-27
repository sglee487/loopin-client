import { configureStore } from '@reduxjs/toolkit';
import playlistsSlice from '@/features/playlists/playlistsSlice';
import playerSlice from '@/features/player/playerSlice';
import { playlistsApi } from '@/features/playlists/api/playlistsApi';

export const store = configureStore({
  reducer: {
    playlists: playlistsSlice,
    player: playerSlice,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      playlistsApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
