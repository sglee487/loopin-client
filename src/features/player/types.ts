export interface PlayerState {
  currentVideo: VideoItem | null;
  queue: VideoItem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  history: VideoItem[];
  panelExpanded: boolean;
}

export interface VideoItem {
  id: number;
  title: string;
  thumbnail?: string;
  channelTitle: string;
  publishedAt: string;
  durationSeconds: number;
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
} 