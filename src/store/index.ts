import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { playlistsApi } from '@/features/playlists/id/playlistDetailApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [playlistsApi.reducerPath]: playlistsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(playlistsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 