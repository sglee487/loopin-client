/* src/types/media.ts */

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
}

export interface CreatePlaylistRequest {
  resourceId: string;
}

export interface SliceResponse<T> {
  items: T[];
  hasNext: boolean;
}