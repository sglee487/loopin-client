import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import { playlistsApi } from '@/features/playlists/playlistsApi';

export const store = configureStore({
  reducer: {
    ...rootReducer,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      playlistsApi.middleware
    ),
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
