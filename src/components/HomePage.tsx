import { useGetPlaylistsSliceQuery } from "@/features/playlists/api/playlistsApi";
import { useGetStreamsQuery } from "@/features/streams/api/streamsApi";
import PlaylistCard from "@/components/PlaylistCard";
import SessionPlaylistCard from "@/components/SessionPlaylistCard";
import StreamCard from "@/features/streams/components/StreamCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useGetSessionsQuery } from "@/features/player/api/playSessionApi";
import {
  useGetCurrentUserQuery,
  useLogoutMutation,
} from "@/features/auth/api/authApi";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stream } from "@/features/streams/types";

export default function HomePage() {
  const navigate = useNavigate();

  const {
    data: playlistsResponse,
    isLoading: playlistsLoading,
    isError: playlistsError,
  } = useGetPlaylistsSliceQuery();

  const {
    data: streams = [],
    isLoading: streamsLoading,
    isError: streamsError,
  } = useGetStreamsQuery();

  // 현재 로그인 여부 확인
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();

  // 로그인된 경우에만 세션 정보를 불러온다
  const {
    data: sessions,
    isLoading: sessionsLoading,
    isError: sessionsLoadError,
    error: sessionsError,
  } = useGetSessionsQuery(undefined, { skip: userLoading || !currentUser });

  const [logout] = useLogoutMutation();

  // 세션 API 에러 처리 (401/403은 인증 문제, 그 외는 서버 문제)
  useEffect(() => {
    if (!sessionsLoading && currentUser && sessionsLoadError && sessionsError) {
      // 에러 타입 확인
      if ('status' in sessionsError) {
        const status = sessionsError.status;
        if (status === 401 || status === 403) {
          // 인증 에러 - 로그아웃 필요
          console.error('인증 에러 발생:', status);
          alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요.");
          (async () => {
            try {
              await logout().unwrap();
            } finally {
              window.location.reload();
            }
          })();
        } else if (status === 500 || status === 503) {
          // 서버 에러 - 일시적인 문제일 수 있으므로 로그아웃하지 않음
          console.error('서버 에러 발생:', status);
        } else {
          // 기타 에러
          console.error('알 수 없는 에러 발생:', status);
        }
      }
    }
  }, [sessionsLoading, sessionsLoadError, sessionsError, currentUser, logout]);

  const handleStreamClick = (stream: Stream) => {
    navigate(`/streams/${stream.publicId}`);
  };

  if (playlistsLoading || streamsLoading || userLoading || sessionsLoading) {
    return <LoadingSpinner />;
  }

  if (playlistsError) {
    return <ErrorMessage message="플레이리스트를 불러오는 중 오류가 발생했습니다." />;
  }

  const playlists = playlistsResponse?.items || [];

  return (
    <div className="container mx-auto py-6">
      {/* Continue Listening Section */}
      {currentUser &&
        sessions &&
        !sessionsLoading &&
        !sessionsLoadError &&
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

      {/* Live Streams Section */}
      {!streamsError && streams.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-100">
            Live Streams
          </h2>
          <div className="grid grid-cols-3 8xl:grid-cols-4 9xl:grid-cols-5 10xl:grid-cols-6 gap-4">
            {streams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onClick={handleStreamClick}
              />
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