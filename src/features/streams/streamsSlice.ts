import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StreamsState {
  selectedStreamId: string | null;
  selectedQuality: string;
  isPlaying: boolean;
  volume: number;
}

const initialState: StreamsState = {
  selectedStreamId: null,
  selectedQuality: 'auto',
  isPlaying: false,
  volume: 0.4,
};

const streamsSlice = createSlice({
  name: 'streams',
  initialState,
  reducers: {
    setSelectedStream: (state, action: PayloadAction<string | null>) => {
      state.selectedStreamId = action.payload;
    },
    setSelectedQuality: (state, action: PayloadAction<string>) => {
      state.selectedQuality = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
  },
});

export const {
  setSelectedStream,
  setSelectedQuality,
  setIsPlaying,
  setVolume,
} = streamsSlice.actions;

export default streamsSlice.reducer;