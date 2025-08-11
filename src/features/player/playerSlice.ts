import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlayerState, PlayVideoPayload } from './types';

const initialState: PlayerState = {
  currentVideo: null,
  queue: [],
  history: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  // Load saved volume from localStorage (0-1 range); default to 1
  volume: (() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const saved = parseFloat(localStorage.getItem("playerVolume") || "");
      if (!isNaN(saved) && saved >= 0 && saved <= 1) {
        return saved;
      }
    }
    return 1;
  })(),
  panelExpanded: false,
  currentPlaylistId: null,
  loopEnabled: false,
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
    setCurrentPlaylistId: (state, action: PayloadAction<number | null>) => {
      state.currentPlaylistId = action.payload;
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
      
      // 새로 듣기 시작할 때 플레이어 패널을 자동으로 확장
      state.panelExpanded = true;
      
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
      } else if (state.loopEnabled && (state.history.length > 0 || state.currentVideo)) {
        // Loop: 재생목록이 끝났으면 역사 + 현재 비디오를 대기열로 재구성
        const rebuilt: typeof state.queue = [];

        // 현재 비디오를 history 로 이동하고 큐를 재생성한다
        if (state.currentVideo) {
          state.history.unshift(state.currentVideo);
        }

        // history 에는 가장 최근 항목이 앞에 있으므로, 반복 시 원래 순서대로 재생하려면 역순으로 큐를 구축한다
        rebuilt.push(...state.history.reverse());

        // 비워둔 history
        state.history = [];

        // 새로운 큐 설정 및 첫 번째 비디오 재생
        state.queue = rebuilt;
        state.currentVideo = state.queue.shift() || null;
        state.currentTime = 0;
        state.isPlaying = true;
      } else {
        // Keep the last played video so that the player bar remains visible
        // when all items in the queue have finished playing. Simply stop
        // playback instead of clearing the currentVideo.
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
      state.currentVideo = null; // Reset current video to prevent cross-playlist interference
      state.currentTime = 0;
      state.isPlaying = false;
    },
    
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.queue = state.queue.filter(video => video.id !== action.payload);
    },
    
    removeFromHistory: (state, action: PayloadAction<number>) => {
      state.history = state.history.filter(video => video.id !== action.payload);
    },
    
    loadSession: (state, action: PayloadAction<import('./types').LoadSessionPayload>) => {
      const { current, prevItems, nextItems, startSeconds = 0, playlistId } = action.payload;
      state.currentVideo = current;
      state.history = [...prevItems].reverse();
      state.queue = [...nextItems];
      state.currentTime = startSeconds;
      state.isPlaying = true;

      if (typeof playlistId === 'number') {
        state.currentPlaylistId = playlistId;
      }
    },
    toggleLoop: (state) => {
      state.loopEnabled = !state.loopEnabled;
    },
    shuffleQueue: (state, action: PayloadAction<import('./types').VideoItem[] | undefined>) => {
      if (action.payload) {
        // 외부에서 섞은 queue를 그대로 반영
        state.queue = action.payload;
        return;
      }
      if (state.queue.length > 1) {
        for (let i = state.queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
        }
      }
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
  removeFromHistory,
  setPanelExpanded,
  togglePanel,
  setCurrentPlaylistId,
  toggleLoop,
  shuffleQueue,
} = playerSlice.actions;

export default playerSlice.reducer; 