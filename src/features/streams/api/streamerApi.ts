import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { StreamerInfo, CreateStreamRequest, UpdateStreamRequest } from '../types';
import { API_BASE_URL } from '@/lib/config';

export const streamerApi = createApi({
  reducerPath: 'streamerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // CSRF 토큰을 쿠키에서 읽어 헤더에 추가
      const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
      if (match) {
        headers.set('X-XSRF-TOKEN', decodeURIComponent(match[1]));
      }
      return headers;
    },
  }),
  tagTypes: ['StreamerInfo'],
  endpoints: (builder) => ({
    // Get my stream key and info
    getMyStream: builder.query<StreamerInfo, void>({
      query: () => '/stream',
      providesTags: ['StreamerInfo'],
    }),

    // Create stream key
    createStreamKey: builder.mutation<StreamerInfo, CreateStreamRequest>({
      query: (request) => ({
        url: '/stream',
        method: 'POST',
        body: request,
      }),
      invalidatesTags: ['StreamerInfo'],
    }),

    // Update stream metadata (title, description, etc.)
    updateStreamMetadata: builder.mutation<StreamerInfo, UpdateStreamRequest>({
      query: (request) => ({
        url: '/stream',
        method: 'PATCH',
        body: request,
      }),
      invalidatesTags: ['StreamerInfo'],
    }),

    // Refresh stream key
    refreshStreamKey: builder.mutation<StreamerInfo, void>({
      query: () => ({
        url: '/stream/refresh',
        method: 'PATCH',
      }),
      invalidatesTags: ['StreamerInfo'],
    }),
  }),
});

export const {
  useGetMyStreamQuery,
  useCreateStreamKeyMutation,
  useUpdateStreamMetadataMutation,
  useRefreshStreamKeyMutation,
} = streamerApi;
