import { useGetPlaylistsSliceQuery } from "./playlistsApi";
import PlaylistCard from "@/components/PlaylistCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

/** 루트(/)에서 렌더되는 플레이리스트 메인 페이지 */
export default function PlaylistsPage() {
  // 서버 데이터 + 로딩 플래그
  const {
    data: playlistsResponse,
    isLoading: playlistsLoading,
    isError: playlistsError,
  } = useGetPlaylistsSliceQuery();

  // 통합 로딩/에러 처리
  if (playlistsLoading) {
    return <LoadingSpinner />;
  }

  if (playlistsError) {
    return <ErrorMessage message="데이터를 불러오는 중 오류가 발생했습니다." />;
  }

  const playlists = playlistsResponse?.items || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 전체 플레이리스트 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Playlists</h2>
        <div className="grid grid-cols-3 8xl:grid-cols-4 9xl:grid-cols-5 10xl:grid-cols-6 gap-4">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.resourceId} playlist={pl} />
          ))}
        </div>
        {playlists.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            등록된 플레이리스트가 없습니다.
          </p>
        )}
      </section>
    </div>
  );
}
