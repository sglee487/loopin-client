import { useGetPlaylistsSliceQuery } from "../api/playlistsApi";
import PlaylistCard from "@/components/PlaylistCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function ListPage() {
  const {
    data: playlistsResponse,
    isLoading,
    isError,
  } = useGetPlaylistsSliceQuery();

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <ErrorMessage message="데이터를 불러오는 중 오류가 발생했습니다." />;

  const playlists = playlistsResponse?.items || [];

  return (
    <div className="container mx-auto px-4 py-6">
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
