import React from "react";
import {
  useGetPlaylistsSliceQuery,
} from "./playlistsApi";
import PlaylistCard from "@/components/PlaylistCard";
import type { MediaPlaylist } from "@/types/media";

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
    return (
      <div className="flex h-[60vh] items-center justify-center text-lg font-semibold">
        Loading…
      </div>
    );
  }

  if (playlistsError) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-red-600">
        데이터를 불러오는 중 오류가 발생했습니다.
      </div>
    );
  }

  const playlists = playlistsResponse?.items || [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 전체 플레이리스트 */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Playlists</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((pl) => (
            <div key={pl.resourceId} className="">
              <PlaylistCard playlist={pl} />
            </div>
          ))}
        </div>
        {playlists.length === 0 && (
          <p className="mt-6 text-center text-gray-500">등록된 플레이리스트가 없습니다.</p>
        )}
      </section>
    </div>
  );
};