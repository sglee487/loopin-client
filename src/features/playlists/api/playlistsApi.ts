import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  MediaPlaylist,
  CreatePlaylistRequest,
  SliceResponse,
} from '../types';
import { API_BASE_URL } from '@/lib/config';

export type ListPlaylistsParams = {
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
  offset?: number;
};

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/api/v1/playlists`,
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
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
    getPlaylistsSlice: builder.query<SliceResponse<MediaPlaylist>, ListPlaylistsParams | void>({
      query: (params) => {
        const {
          size = 20,
          sortBy = 'createdAt',
          direction = 'DESC',
          offset = 0,
        } = params || {};
        return {
          url: '',
          params: { size, sortBy, direction, offset },
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Playlist' as const, id })),
              { type: 'Playlist' as const, id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Playlist' as const, id: 'PARTIAL-LIST' }],
    }),

    getPlaylistById: builder.query<MediaPlaylist, number>({
      query: (id) => `/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Playlist', id }],
    }),

    getPlaylistByResourceId: builder.query<MediaPlaylist, string>({
      query: (resourceId) => `/youtube/${resourceId}`,
      providesTags: (_res, _err, resourceId) => [
        { type: 'Playlist', id: resourceId },
      ],
    }),

    createPlaylistFromYoutube: builder.mutation<MediaPlaylist, CreatePlaylistRequest>({
      query: (body) => ({
        url: '/youtube',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_res, _err, body) => [
        { type: 'Playlist', id: body.resourceId },
        { type: 'Playlist', id: 'PARTIAL-LIST' },
      ],
    }),

    deletePlaylistByResourceId: builder.mutation<void, string>({
      query: (resourceId) => ({
        url: `/youtube/${resourceId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, resourceId) => [
        { type: 'Playlist', id: resourceId },
        { type: 'Playlist', id: 'PARTIAL-LIST' },
      ],
    }),
  }),
});

export const {
  useGetPlaylistsSliceQuery,
  useGetPlaylistByIdQuery,
  useGetPlaylistByResourceIdQuery,
  useCreatePlaylistFromYoutubeMutation,
  useDeletePlaylistByResourceIdMutation,
} = playlistsApi; 