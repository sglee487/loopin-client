import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

import {
  loadUserCurrentPlays,
  loadUserPlayListQueues,
} from "../apis/videoList";
import { CurrentPlays, PlayLists } from "../types/PlayLists";

export interface CounterState {
  playListQuques: PlayLists;
  currentPlays: CurrentPlays;
}

const initialState: CounterState = {
  playListQuques: {},
  currentPlays: {},
};

export const playsSlice = createSlice({
  name: "plays",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(downloadUserCurrentPlaysAsync.fulfilled, (state, action) => {
        for (const key in action.payload) {
          state.currentPlays[key] = action.payload[key];
        }
      })
      .addCase(downloadUserPlayListQueuesAsync.fulfilled, (state, action) => {
        const prevData = action.payload.prev;
        const nextData = action.payload.next;

        state.playListQuques[action.payload.playListId] = {
          prev: prevData,
          next: nextData,
        };
      });
  },
});

// export const { increment, decrement, incrementByAmount } = playsSlice.actions;

export default playsSlice.reducer;

export const selectPlayLists = (state: RootState) => state.plays.playListQuques;
export const selectCurrentPlays = (state: RootState) =>
  state.plays.currentPlays;

export const downloadUserCurrentPlaysAsync = createAsyncThunk(
  "plays/downloadUserCurrentPlays",
  async () => {
    const currentPlaysData = await loadUserCurrentPlays();
    return currentPlaysData;
  }
);

export const downloadUserPlayListQueuesAsync = createAsyncThunk(
  "plays/downloadUserPlayListQueues",
  async (playListId: string) => {
    const playListQueuesData = await loadUserPlayListQueues(playListId);
    return playListQueuesData;
  }
);
