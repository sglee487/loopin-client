import { configureStore } from '@reduxjs/toolkit';
import playlistsSlice from '@/features/playlists/playlistsSlice';
import playerSlice from '@/features/player/playerSlice';
import { playlistsApi } from '@/features/playlists/api/playlistsApi';
import { authApi } from '@/features/auth/api/authApi';
import { playSessionApi } from '@/features/player/api/playSessionApi';

export const store = configureStore({
  reducer: {
    playlists: playlistsSlice,
    player: playerSlice,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [playSessionApi.reducerPath]: playSessionApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      playlistsApi.middleware,
      authApi.middleware,
      playSessionApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
