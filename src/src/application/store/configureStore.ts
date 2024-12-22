import { configureStore } from '@reduxjs/toolkit';
import helloWorldReducer from '../reducers/helloWorldReducer';
import playItemReducer from '../reducers/playItemReducer';

export const store = configureStore({
  reducer: {
    helloWorld: helloWorldReducer,
    playItems: playItemReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: true
});

export type AppDispatch = typeof store.dispatch;