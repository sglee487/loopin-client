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
import { useKeycloak } from "@react-keycloak/web";

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
      if (
        state.currentPlays[playListId] &&
        state.currentPlays[playListId].item
      ) {
        playListQueue.prev.push(state.currentPlays[playListId].item);
      }

      const nextItem = playListQueue.next.shift();
      if (nextItem) {
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
      }
    },
    playSelectedVideo: (
      state,
      action: PayloadAction<{
        playListId: string;
        selectedPlayListItem: PlayListItem;
      }>
    ) => {
      const { playListId, selectedPlayListItem } = action.payload;
      const playListQueue = state.playListQuques[playListId];
      if (
        state.currentPlays[playListId] &&
        state.currentPlays[playListId].item
      ) {
        playListQueue.prev.push(state.currentPlays[playListId].item);
      }
      // filter prev and next queue regardless of where the selected video is
      playListQueue.prev = playListQueue.prev.filter(
        (item) =>
          item.resource.videoId !== selectedPlayListItem.resource.videoId
      );
      playListQueue.next = playListQueue.next.filter(
        (item) =>
          item.resource.videoId !== selectedPlayListItem.resource.videoId
      );

      state.currentPlays[playListId] = {
        startSeconds: 0,
        playListId: playListId,
        channelId: selectedPlayListItem.channelId,
        title: selectedPlayListItem.title,
        description: selectedPlayListItem.description,
        thumbnail: selectedPlayListItem.thumbnail,
        channelTitle: selectedPlayListItem.channelTitle,
        localized: {
          title: selectedPlayListItem.title,
          description: selectedPlayListItem.description,
        },
        contentDetails: {
          itemCount: 1,
        },
        item: selectedPlayListItem,
        publishedAt: selectedPlayListItem.publishedAt,
        updatedAt: new Date().toISOString(),
      };
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
    setStartSeconds: (
      state,
      action: PayloadAction<{
        token?: string;
        playListId: string;
        startSeconds: number;
      }>
    ) => {
      console.log(action);
      console.log(action.payload);
      const { token, playListId, startSeconds } = action.payload;
      state.currentPlays[playListId].startSeconds = startSeconds;

      console.log(state.currentPlays[playListId]);

      if (token) {
        uploadUserPlayListQueue(
          token,
          playListId,
          state.playListQuques[playListId],
          state.currentPlays[playListId]
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
  playSelectedVideo,
  prevQueue,
  shuffleNextQueue,
  setStartSeconds,
} = playsSlice.actions;

export default playsSlice.reducer;

export const selectPlayLists = (state: RootState) => state.plays.playListQuques;
export const selectCurrentPlays = (state: RootState) =>
  state.plays.currentPlays;

export const downloadUserCurrentPlaysAsync = createAsyncThunk(
  "plays/downloadUserCurrentPlays",
  async (payload: { token: string }) => {
    const { token } = payload;
    const currentPlaysData = await loadUserCurrentPlays(token);
    return currentPlaysData;
  }
);

export const downloadUserPlayListQueueAsync = createAsyncThunk(
  "plays/downloadUserPlayListQueue",
  async (payload: {
    token: string;
    playListId: string;
    playListQueue: PlayListQueue;
    currentPlay: CurrentPlay;
  }) => {
    const { token, playListId } = payload;
    const playListQueuesData = await loadUserPlayListQueue(token, playListId);
    return playListQueuesData;
  }
);

export const updateUserPlayListQueueAsync = createAsyncThunk(
  "plays/uploadUserPlayListQueue",
  async (payload: {
    token: string;
    playListId: string;
    playListQueue: PlayListQueue;
    currentPlay: CurrentPlay;
  }) => {
    const { token, playListId, playListQueue, currentPlay } = payload;
    uploadUserPlayListQueue(token, playListId, playListQueue, currentPlay);
  }
);
