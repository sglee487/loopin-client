import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

import {
  loadUserCurrentPlays,
  loadUserPlayListQueues as loadUserPlayListQueue,
  uploadUserPlayListQueue,
} from "../apis/videoList";
import {
  CurrentPlays,
  PlayLists,
  PlayListQueue,
  CurrentPlay,
  PlayListItem,
} from "../types/PlayLists";

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
  reducers: {
    initPlayListQueues: (
      state,
      action: PayloadAction<{
        playListId: string;
        items: PlayListItem[];
      }>
    ) => {
      const playListId = action.payload.playListId;
      const playListItems = action.payload.items;
      state.playListQuques[playListId] = {
        prev: [],
        next: playListItems,
      };
    },
    playNextQueue: (state, action: PayloadAction<string>) => {
      const playListId = action.payload;
      const playListQueue = state.playListQuques[playListId];
      if (playListQueue) {
        const nextItem = playListQueue.next.shift();
        if (nextItem) {
          if (state.currentPlays[playListId] === undefined) {
            state.currentPlays[playListId] = {
              startSeconds: 0,
              playListId: playListId,
              channelId: nextItem.channelId,
              title: nextItem.title,
              description: nextItem.description,
              thumbnail: nextItem.thumbnail,
              channelTitle: nextItem.channelTitle,
              localized: {
                title: nextItem.title,
                description: nextItem.description,
              },
              contentDetails: {
                itemCount: 1,
              },
              item: nextItem,
              publishedAt: nextItem.publishedAt,
              updatedAt: new Date().toISOString(),
            };
          } else {
            state.currentPlays[playListId].item = nextItem;
          }
          playListQueue.prev.push(nextItem);
        }
      }
    },
    prevQueue: (state, action: PayloadAction<string>) => {
      const playListId = action.payload;
      const playListQueues = state.playListQuques[playListId];
      if (playListQueues) {
        const prevItem = playListQueues.prev.pop();
        if (prevItem) {
          playListQueues.next.unshift(prevItem);
        }
      }
    },
    shuffleNextQueue: (state, action: PayloadAction<string>) => {
      const playListId = action.payload;
      const playListQueues = state.playListQuques[playListId];
      if (playListQueues) {
        const nextItem = playListQueues.next.shift();
        if (nextItem) {
          playListQueues.prev.push(nextItem);
        }
        playListQueues.next = playListQueues.next.sort(
          () => Math.random() - 0.5
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadUserCurrentPlaysAsync.fulfilled, (state, action) => {
        for (const key in action.payload) {
          state.currentPlays[key] = action.payload[key];
        }
      })
      .addCase(downloadUserPlayListQueueAsync.fulfilled, (state, action) => {
        const prevData = action.payload.prev;
        const nextData = action.payload.next;

        state.playListQuques[action.payload.playListId] = {
          prev: prevData,
          next: nextData,
        };
      }).addCase;
  },
});

export const {
  initPlayListQueues,
  playNextQueue,
  prevQueue,
  shuffleNextQueue,
} = playsSlice.actions;

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

export const downloadUserPlayListQueueAsync = createAsyncThunk(
  "plays/downloadUserPlayListQueue",
  async (playListId: string) => {
    const playListQueuesData = await loadUserPlayListQueue(playListId);
    return playListQueuesData;
  }
);

export const updateUserPlayListQueueAsync = createAsyncThunk(
  "plays/uploadUserPlayListQueue",
  async (payload: {
    playListId: string;
    playListQueue: PlayListQueue;
    currentPlay: CurrentPlay;
  }) => {
    const { playListId, playListQueue, currentPlay } = payload;
    uploadUserPlayListQueue(playListId, playListQueue, currentPlay);
  }
);
