import { useGetPlaylistsSliceQuery } from "../api/playlistsApi";
import PlaylistCard from "@/components/PlaylistCard";
import SessionPlaylistCard from "@/components/SessionPlaylistCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGetSessionsQuery } from "@/features/player/api/playSessionApi";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/api/authApi";
import { useEffect } from "react";

export default function ListPage() {
  const {
    data: playlistsResponse,
    isLoading,
    isError,
  } = useGetPlaylistsSliceQuery();

  // 현재 로그인 여부 확인
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();

  // 로그인된 경우에만 세션 정보를 불러온다
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsError,
  } = useGetSessionsQuery(undefined, { skip: userLoading || !currentUser });

  const [logout] = useLogoutMutation();

  // sessions가 null이면 유효하지 않은 사용자 세션으로 간주하고 로그아웃
  useEffect(() => {
    if (!sessionsLoading && currentUser && sessions === null) {
      alert("로그인 세션이 유효하지 않습니다. 다시 로그인해주세요.");
      (async () => {
        try {
          await logout().unwrap();
        } finally {
          window.location.reload();
        }
      })();
    }
  }, [sessionsLoading, sessions, currentUser, logout]);

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <ErrorMessage message="데이터를 불러오는 중 오류가 발생했습니다." />;

  const playlists = playlistsResponse?.items || [];

  return (
    <div className="container mx-auto py-6">
      {/* Continue Listening Section */}
      {currentUser &&
        sessions &&
        !sessionsLoading &&
        !sessionsError &&
        sessions.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
              이어 듣기
            </h2>
            <div className="grid grid-cols-3 8xl:grid-cols-4 9xl:grid-cols-5 10xl:grid-cols-6 gap-4">
              {sessions.map((s) => (
                <SessionPlaylistCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        )}

      {/* All playlists section */}
      <section>
        <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
          Playlists
        </h2>
        <div className="grid grid-cols-3 8xl:grid-cols-4 9xl:grid-cols-5 10xl:grid-cols-6 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.resourceId} playlist={pl} />
          ))}
        </div>
        {playlists.length === 0 && (
          <p className="mt-6 text-center text-neutral-500 dark:text-neutral-400">
            등록된 플레이리스트가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}
