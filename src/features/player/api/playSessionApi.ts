import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MediaPlaylist, MediaItem } from '@/features/playlists/types';

export interface SavePlaySessionPayload {
  playlistId: number;
  nowPlayingItemId: number;
  startSeconds: number;
  prevItems: number[];
  nextItems: number[];
}

export interface PlaySession {
  id?: number;
  startSeconds: number;
  prevItems: MediaItem[] | null;
  nextItems: MediaItem[] | null;
  prevItemsLength?: number;
  nextItemsLength?: number;
  playlist?: MediaPlaylist;
  nowPlaying?: MediaItem;
  updatedAt?: string;
}

const BASE_URL = 'http://localhost:59000/api/v1/user-play-session';

export const playSessionApi = createApi({
  reducerPath: 'playSessionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const cookie = document.cookie
        .split('; ')
        .find((c) => c.startsWith('XSRF-TOKEN='));
      if (cookie) {
        const csrf = decodeURIComponent(cookie.split('=')[1]);
        headers.set('X-XSRF-TOKEN', csrf);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    saveSession: builder.mutation<void, SavePlaySessionPayload>({
      query: ({ playlistId, ...body }) => ({
        url: `/sessions/${playlistId}`,
        method: 'PUT',
        body,
      }),
    }),

    getSession: builder.query<PlaySession, number>({
      query: (playlistId) => `/sessions/${playlistId}`,
    }),

    getSessions: builder.query<PlaySession[], void>({
      query: () => '/sessions',
    }),

    updateStartSeconds: builder.mutation<void, { playlistId: number; startSeconds: number }>({
      query: ({ playlistId, startSeconds }) => ({
        url: `/sessions/${playlistId}/start-seconds`,
        method: 'PATCH',
        body: { startSeconds },
      }),
    }),
  }),
});

export const {
  useSaveSessionMutation,
  useGetSessionQuery,
  useGetSessionsQuery,
  useUpdateStartSecondsMutation,
} = playSessionApi; 