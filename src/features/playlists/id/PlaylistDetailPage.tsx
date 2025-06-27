import { useParams, useNavigate } from "react-router-dom";
import { useGetPlaylistByIdQuery } from "../playlistsApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDuration, formatDate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  PlayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { MediaItem } from "../types";

/** 플레이리스트 상세 페이지 */
export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const playlistId = id ? parseInt(id, 10) : 0;

  const {
    data: playlist,
    isLoading,
    isError,
  } = useGetPlaylistByIdQuery(playlistId, {
    skip: !playlistId,
  });

  const handleBackClick = () => {
    navigate(-1);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !playlist) {
    return (
      <ErrorMessage message="플레이리스트를 불러오는 중 오류가 발생했습니다." />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={handleBackClick}
        className="flex items-center gap-2 text-[#9eb8a8] hover:text-white transition-colors mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        뒤로가기
      </button>

      {/* 플레이리스트 헤더 */}
      <div className="flex gap-6 mb-8">
        {/* 썸네일 */}
        <div className="flex-shrink-0">
          <img
            src={playlist.thumbnail}
            alt={`${playlist.title} thumbnail`}
            className="w-64 h-48 object-cover rounded-lg"
          />
        </div>

        {/* 플레이리스트 정보 */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-4">
            {playlist.title}
          </h1>

          <div className="flex items-center gap-4 text-[#9eb8a8] mb-4">
            <span>{playlist.channelTitle}</span>
            <span>•</span>
            <span>{playlist.itemCount}개 동영상</span>
            <span>•</span>
            <span>{formatDate(playlist.publishedAt)}</span>
          </div>

          {playlist.description && (
            <p className="text-[#9eb8a8] text-sm leading-relaxed mb-4">
              {playlist.description}
            </p>
          )}

          {/* 플레이 버튼 */}
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            <PlayIcon className="h-5 w-5" />
            전체 재생
          </button>
        </div>
      </div>

      {/* 동영상 목록 */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">동영상 목록</h2>

        {playlist.items && playlist.items.length > 0 ? (
          <div className="space-y-3">
            {playlist.items.map((item: MediaItem) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
              >
                {/* 동영상 썸네일 */}
                <div className="flex-shrink-0 relative">
                  <img
                    src={item.thumbnail}
                    alt={`${item.title} thumbnail`}
                    className="w-32 h-20 object-cover rounded"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-70 rounded-full p-1">
                      <PlayIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>

                {/* 동영상 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[#9eb8a8] text-sm mb-1">
                    {item.channelTitle}
                  </p>
                  <div className="flex items-center gap-4 text-[#9eb8a8] text-sm">
                    <span>{formatDate(item.publishedAt)}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatDuration(item.durationSeconds)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-[#9eb8a8]">
            동영상이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
