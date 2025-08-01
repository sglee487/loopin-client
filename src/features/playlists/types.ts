export interface MediaItem {
  id: number;
  resourceId: string;
  title: string;
  description?: string;
  kind: string;
  publishedAt: string;
  thumbnail?: string;
  videoOwnerChannelId: string;
  videoOwnerChannelTitle: string;
  platformType: string;
  durationSeconds: number;
  /** Sorting key within playlist */
  rankKey: string;
  /** @deprecated Use rankKey instead */
  position?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MediaPlaylist {
  id?: number;
  resourceId: string;
  title: string;
  description?: string;
  kind: string;
  thumbnail?: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  platformType: string;
  itemCount: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  items?: MediaItem[];
}

export interface CreatePlaylistRequest {
  resourceId: string;
  type?: string;
}

export interface SliceResponse<T> {
  items: T[];
  hasNext: boolean;
}

export interface UIState {
  sort: 'title' | 'recent';
  filterText: string;
} 