import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface User {
  username: string;
  fullName?: string;
  roles?: string[];
}

/**
 * Spring Security + Gateway용 인증 API
 *  - GET /user : 현재 로그인 사용자 정보
 *  - POST /logout : 로그아웃 (CSRF 필요)
 *  - login은 단순 redirect 로 처리
 */
const GATEWAY_URL = 'http://localhost:59000';

const baseQuery = fetchBaseQuery({
  baseUrl: GATEWAY_URL,
  credentials: 'include',
  prepareHeaders: (headers) => {
    // CookieServerCsrfTokenRepository는 XSRF-TOKEN 쿠키를 내려줍니다.
    // 이를 읽어 X-XSRF-TOKEN 헤더에 실어주면 POST/DELETE 등에서 CSRF 검증이 통과합니다.
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    if (match) {
      headers.set('X-XSRF-TOKEN', decodeURIComponent(match[1]));
    }
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    getCurrentUser: builder.query<User, void>({
      query: () => '/api/v1/user',
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetCurrentUserQuery, useLogoutMutation } = authApi; 