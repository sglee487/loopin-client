import {
  createAsyncThunk,
  createSlice,
  original,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "../app/store";

import {
  deleteUserPlayListQueue,
  loadUserCurrentPlays,
  loadUserPlayListQueues as loadUserPlayListQueue,
  PlayListData,
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
        playListData: PlayListData;
      }>
    ) => {
      const playListId = action.payload.playListId;
      const playListData = action.payload.playListData;

      state.currentPlays[playListId] = {
        startSeconds: 0,
        playListId: playListData.playListId,
        channelId: playListData.channelId,
        title: playListData.title,
        description: playListData.description,
        thumbnail: playListData.thumbnail,
        channelTitle: playListData.channelTitle,
        localized: {
          title: playListData.title,
          description: playListData.description,
        },
        contentDetails: {
          itemCount: playListData.contentDetails.itemCount,
        },
        item: null,
        publishedAt: playListData.publishedAt,
        updatedAt: new Date().toISOString(),
      };

      state.playListQuques[playListId] = {
        prev: [],
        next: playListData.items,
      };
    },
    getCurrentPlays: (
      state,
      action: PayloadAction<{
        token?: string;
      }>
    ) => {
      const { token } = action.payload;
      if (token) {
        loadUserCurrentPlays(token);
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
      if (selectedPlayListItem === undefined) {
        return;
      }
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

      state.currentPlays[playListId].startSeconds = 0;
      state.currentPlays[playListId].item = selectedPlayListItem;
    },
    backToPrevQueue: (state, action: PayloadAction<string>) => {
      const playListId = action.payload;
      const playListQueue = state.playListQuques[playListId];
      if (playListQueue.prev.length === 0) {
        return;
      }
      const currentItem = state.currentPlays[playListId].item;
      const prevItem = playListQueue.prev.pop();
      if (prevItem) {
        state.currentPlays[playListId].item = prevItem;
        state.currentPlays[playListId].startSeconds = 0;
        if (currentItem) {
          playListQueue.next.unshift(currentItem);
        }
      }
    },
    shuffleNextQueue: (state, action: PayloadAction<string>) => {
      // shuffle next queue list only
      const playListId = action.payload;
      const playListQueues = state.playListQuques[playListId];
      if (playListQueues) {
        playListQueues.next = playListQueues.next.sort(
          () => Math.random() - 0.5
        );
      }
    },
    deletePlayList: (
      state,
      action: PayloadAction<{
        token?: string;
        playListId: string;
      }>
    ) => {
      const { token, playListId } = action.payload;

      delete state.currentPlays[playListId];
      delete state.playListQuques[playListId];

      if (token) {
        deleteUserPlayListQueue(token, playListId);
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
      const { token, playListId, startSeconds } = action.payload;

      state.currentPlays[playListId].startSeconds = startSeconds;

      if (token) {
        uploadUserPlayListQueue(
          token,
          playListId,
          original(state.playListQuques[playListId]) as PlayListQueue,
          original(state.currentPlays[playListId]) as CurrentPlay
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
  backToPrevQueue,
  playSelectedVideo,
  deletePlayList,
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
