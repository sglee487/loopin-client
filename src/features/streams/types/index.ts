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