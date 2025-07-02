import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, PlayVideoPayload } from './types';

const initialState: PlayerState = {
  currentVideo: null,
  queue: [],
  history: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  panelExpanded: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPanelExpanded: (state, action: PayloadAction<boolean>) => {
      state.panelExpanded = action.payload;
    },
    togglePanel: (state) => {
      state.panelExpanded = !state.panelExpanded;
    },
    playVideo: (state, action: PayloadAction<PlayVideoPayload>) => {
      const { video, addToQueue = false } = action.payload;
      
      console.log('playVideo action received:', { video, addToQueue });
      
      if (addToQueue) {
        // 대기열 뒤에 추가만
        state.queue.push(video);
        return; // 현재 재생 유지
      }

      // 새 비디오 즉시 재생 -> 기존 currentVideo 를 history 로 이동
      if (state.currentVideo) {
        state.history.unshift(state.currentVideo);
      }

      state.currentVideo = video;
      state.isPlaying = true;
      state.currentTime = 0;
      
      console.log('New player state:', { currentVideo: state.currentVideo, queue: state.queue });
    },
    
    pauseVideo: (state) => {
      state.isPlaying = false;
    },
    
    resumeVideo: (state) => {
      state.isPlaying = true;
    },
    
    nextVideo: (state) => {
      if (state.queue.length > 0) {
        // 현재 비디오를 history 로 이동
        if (state.currentVideo) {
          state.history.unshift(state.currentVideo);
        }
        // 대기열 맨 앞의 비디오를 현재 비디오로 설정
        state.currentVideo = state.queue.shift() || null;
        state.currentTime = 0;
      } else {
        state.currentVideo = null;
        state.isPlaying = false;
      }
    },
    
    previousVideo: (state) => {
      if (state.history.length > 0) {
        // 현재 비디오를 queue 맨 앞에 넣고 history 첫 항목을 현재로
        if (state.currentVideo) {
          state.queue.unshift(state.currentVideo);
        }
        state.currentVideo = state.history.shift() || null;
        state.currentTime = 0;
      } else {
        // history 없으면 처음부터
        state.currentTime = 0;
      }
    },
    
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    
    updateDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    
    updateVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    
    clearQueue: (state) => {
      state.queue = [];
      state.history = [];
    },
    
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue = state.queue.filter(video => video.id !== action.payload);
    },
    
    loadSession: (state, action: PayloadAction<import('./types').LoadSessionPayload>) => {
      const { current, prevItems, nextItems, startSeconds = 0 } = action.payload;
      state.currentVideo = current;
      state.history = [...prevItems].reverse();
      state.queue = [...nextItems];
      state.currentTime = startSeconds;
      state.isPlaying = true;
    },
  },
});

export const {
  playVideo,
  loadSession,
  pauseVideo,
  resumeVideo,
  nextVideo,
  previousVideo,
  updateCurrentTime,
  updateDuration,
  updateVolume,
  clearQueue,
  removeFromQueue,
  setPanelExpanded,
  togglePanel,
} = playerSlice.actions;

export default playerSlice.reducer; 