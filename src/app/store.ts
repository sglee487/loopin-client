import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counterSlice";
import playsReducer from "../features/playsSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

// persistReducer를 사용해 Reducer를 감싸줍니다.
const counterPersistedReducer = persistReducer(persistConfig, counterReducer);
const playPersistedPersistConfig = {
  key: "snclient-plays",
  storage,
};
const playPersistedReducer = persistReducer(
  playPersistedPersistConfig,
  playsReducer
);

export const store = configureStore({
  reducer: {
    counter: counterPersistedReducer,
    plays: playPersistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Persistor 설정
export const persistor = persistStore(store);

// Infer the `RootState`,  `AppDispatch`, and `AppStore` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
