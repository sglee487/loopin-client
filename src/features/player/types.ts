export interface PlayerState {
  currentVideo: VideoItem | null;
  queue: VideoItem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  history: VideoItem[];
  panelExpanded: boolean;
  /** Currently playing playlist id, if a play session is active */
  currentPlaylistId?: number | null;
  /** Whether loop (repeat playlist) mode is enabled */
  loopEnabled?: boolean;
}

export interface VideoItem {
  id: number;
  title: string;
  thumbnail?: string;
  channelTitle: string;
  publishedAt: string;
  durationSeconds: number;
  /** Sorting key within playlist */
  rankKey?: string;
  resourceId: string;
  videoUrl?: string;
}

export interface PlayVideoPayload {
  video: VideoItem;
  addToQueue?: boolean;
}

export interface LoadSessionPayload {
  current: VideoItem;
  prevItems: VideoItem[];
  nextItems: VideoItem[];
  startSeconds?: number;
  playlistId?: number;
} 