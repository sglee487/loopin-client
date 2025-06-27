export interface PlayerState {
  currentVideo: VideoItem | null;
  queue: VideoItem[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  history: VideoItem[];
}

export interface VideoItem {
  id: number;
  title: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  durationSeconds: number;
  videoUrl?: string;
}

export interface PlayVideoPayload {
  video: VideoItem;
  addToQueue?: boolean;
} 