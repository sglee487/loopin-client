import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  MediaPlaylist,
  CreatePlaylistRequest,
  SliceResponse,
} from '../types';

export type ListPlaylistsParams = {
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
  offset?: number;
};

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:59000/api/v1/playlists',
    credentials: 'include',
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
  }),
});

export const {
  useGetPlaylistsSliceQuery,
  useGetPlaylistByIdQuery,
  useGetPlaylistByResourceIdQuery,
  useCreatePlaylistFromYoutubeMutation,
} = playlistsApi; 