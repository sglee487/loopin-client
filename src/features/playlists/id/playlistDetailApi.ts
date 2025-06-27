import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  MediaPlaylist,
  CreatePlaylistRequest,
  SliceResponse,
} from '@/types/media';

/**
 * 매 페이지 호출 시 전달할 파라미터 타입
 */
export type ListPlaylistsParams = {
  /** 가져올 개수(기본 20) */
  size?: number;
  /** 정렬 컬럼(기본 createdAt) */
  sortBy?: string;
  /** 정렬 방향(기본 DESC) */
  direction?: 'ASC' | 'DESC';
  /** OFFSET 기반 커서(기본 0) */
  offset?: number;
};

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:59000/api/v1/playlists', // ← 백엔드 서버 주소
  }),
  tagTypes: ['Playlist'],
  endpoints: (builder) => ({
    /**
     * 무한 스크롤 목록 조회: GET /
     *   ?size=20&sortBy=createdAt&direction=DESC&offset=0
     */
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
      /**
       * 각 아이템과 PARTIAL-LIST 태그를 함께 등록해, 단일/목록 둘 다 쉽게 무효화 가능
       */
      providesTags: (result) =>
        result
          ? [
              ...result.items.map(({ id }) => ({ type: 'Playlist' as const, id })),
              { type: 'Playlist' as const, id: 'PARTIAL-LIST' },
            ]
          : [{ type: 'Playlist' as const, id: 'PARTIAL-LIST' }],
    }),

    /** 내부 PK(Long)로 조회: GET /{id} */
    getPlaylistById: builder.query<MediaPlaylist, number>({
      query: (id) => `/${id}`,
      providesTags: (_res, _err, id) => [{ type: 'Playlist', id }],
    }),

    /** YouTube resourceId로 조회: GET /youtube/{resourceId} */
    getPlaylistByResourceId: builder.query<MediaPlaylist, string>({
      query: (resourceId) => `/youtube/${resourceId}`,
      providesTags: (_res, _err, resourceId) => [
        { type: 'Playlist', id: resourceId },
      ],
    }),

    /** YouTube 기반 신규 생성: POST /youtube */
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

/* ──────────────── 자동 생성 훅 export ──────────────── */
export const {
  useGetPlaylistsSliceQuery,
  useGetPlaylistByIdQuery,
  useGetPlaylistByResourceIdQuery,
  useCreatePlaylistFromYoutubeMutation,
} = playlistsApi;
