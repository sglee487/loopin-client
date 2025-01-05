import { configureStore } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';
import playlistsReducer from '../reducers/playlistsReducer';
import currentPlayMapReducer from '../reducers/currentPlayMapReducer';

// Enable Map and Set support in Immer
enableMapSet();

export const store = configureStore({
  reducer: {
    playlists: playlistsReducer,
    currentPlayMap: currentPlayMapReducer
  },
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;