export interface Stream {
  id: number;
  publicId: string;
  title: string;
  description: string | null;
  status: 'LIVE' | 'OFFLINE' | 'SCHEDULED';
  resolution: string;
  bitrate: number;
  viewersCount: number;
  createdAt: string;
  updatedAt: string;
  hlsUrl: string;
}

export interface StreamListResponse {
  streams: Stream[];
  total: number;
  page: number;
  limit: number;
}

export interface HLSQuality {
  value: string;
  label: string;
  description: string;
  bandwidth?: number;
  resolution?: string;
  frameRate?: number;
}

// Streamer management types
export type StreamStatus = 'CREATED' | 'LIVE' | 'ENDED' | 'ERROR';

export interface StreamerInfo {
  id: number;
  publicId: string;
  streamKey: string;
  title: string;
  description: string | null;
  status: StreamStatus;
  streamerId: string;
  resolution: string;
  bitrate: number;
  viewersCount: number;
  createdAt: string;
  updatedAt: string | null;
  hlsUrl: string;
}

export interface CreateStreamRequest {
  title: string;
  description?: string;
  resolution?: string;
  bitrate?: number;
}

export interface UpdateStreamRequest {
  title?: string;
  description?: string;
  resolution?: string;
  bitrate?: number;
}