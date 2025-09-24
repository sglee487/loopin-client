import { configureStore } from '@reduxjs/toolkit';
import playlistsSlice from '@/features/playlists/playlistsSlice';
import playerSlice from '@/features/player/playerSlice';
import streamsSlice from '@/features/streams/streamsSlice';
import { playlistsApi } from '@/features/playlists/api/playlistsApi';
import { authApi } from '@/features/auth/api/authApi';
import { playSessionApi } from '@/features/player/api/playSessionApi';
import { streamsApi } from '@/features/streams/api/streamsApi';

export const store = configureStore({
  reducer: {
    playlists: playlistsSlice,
    player: playerSlice,
    streams: streamsSlice,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [playSessionApi.reducerPath]: playSessionApi.reducer,
    [streamsApi.reducerPath]: streamsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      playlistsApi.middleware,
      authApi.middleware,
      playSessionApi.middleware,
      streamsApi.middleware,
    ),
});

// Persist player volume to localStorage whenever it changes
if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
  let prevVolume: number | undefined;
  store.subscribe(() => {
    const currentVolume = store.getState().player.volume;
    if (currentVolume !== prevVolume) {
      prevVolume = currentVolume;
      try {
        localStorage.setItem("playerVolume", currentVolume.toString());
      } catch {
        /* ignore quota / unavailable errors */
      }
    }
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
