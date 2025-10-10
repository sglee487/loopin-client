import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Stream } from '../types';
import { API_BASE_URL } from '@/lib/config';

export const streamsApi = createApi({
  reducerPath: 'streamsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1`,
  }),
  tagTypes: ['Stream'],
  endpoints: (builder) => ({
    getStreams: builder.query<Stream[], void>({
      query: () => '/streams',
      providesTags: ['Stream'],
    }),
    getStreamById: builder.query<Stream, string>({
      query: (publicId) => `/streams/${publicId}`,
      providesTags: (_, __, id) => [{ type: 'Stream', id }],
    }),
  }),
});

export const {
  useGetStreamsQuery,
  useGetStreamByIdQuery
} = streamsApi;

export const getHLSMasterUrl = (publicId: string): string => {
  return `${API_BASE_URL}/api/v1/streams/hls/${publicId}/master.m3u8`;
};