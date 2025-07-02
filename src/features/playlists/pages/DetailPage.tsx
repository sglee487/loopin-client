import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useGetPlaylistByIdQuery } from "../api/playlistsApi";
import {
  playVideo,
  clearQueue,
  setPanelExpanded,
} from "@/features/player/playerSlice";
import { useSaveSessionMutation } from "@/features/player/api/playSessionApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { formatDuration, formatDate } from "@/lib/utils";
import {
  ArrowLeftIcon,
  PlayIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import type { MediaItem } from "../types";
import type { VideoItem } from "@/features/player/types";

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [saveSession] = useSaveSessionMutation();
  const playlistId = id ? parseInt(id, 10) : 0;

  const {
    data: playlist,
    isLoading,
    isError,
  } = useGetPlaylistByIdQuery(playlistId, {
    skip: !playlistId,
  });

  const handleVideoClick = (item: MediaItem) => {
    console.log("Video clicked:", item);

    const videoItem: VideoItem = {
      id: item.id,
      title: item.title,
      thumbnail: item.thumbnail,
      channelTitle: item.videoOwnerChannelTitle,
      publishedAt: item.publishedAt,
      durationSeconds: item.durationSeconds,
      resourceId: item.resourceId,
    };

    dispatch(clearQueue());
    dispatch(playVideo({ video: videoItem }));

    // Save play session to server
    if (playlist) {
      const itemsArr = playlist.items ?? [];
      // 느슨한 동등성 비교를 사용하여 문자열-숫자 타입 불일치로 인한 인덱스 탐색 실패를 방지한다
      const clickedIndex = itemsArr.findIndex((v) => v.id == item.id);

      // 클릭한 비디오가 배열에서 발견되지 못한 경우를 대비한 안전한 분기 처리
      const prevItems: number[] =
        clickedIndex > -1
          ? itemsArr.slice(0, clickedIndex).map((v) => v.id)
          : [];
      const nextItems: number[] =
        clickedIndex > -1
          ? itemsArr.slice(clickedIndex + 1).map((v) => v.id)
          : itemsArr.filter((v) => v.id !== item.id).map((v) => v.id);

      saveSession({
        playlistId,
        nowPlayingItemId: item.id,
        startSeconds: 0,
        prevItems,
        nextItems,
      });
    }

    // queue the rest items in order
    if (playlist?.items) {
      const rest = playlist.items.filter((v) => v.id !== item.id);
      rest.forEach((v) => {
        const q: VideoItem = {
          id: v.id,
          title: v.title,
          thumbnail: v.thumbnail,
          channelTitle: v.videoOwnerChannelTitle,
          publishedAt: v.publishedAt,
          durationSeconds: v.durationSeconds,
          resourceId: v.resourceId,
        };
        dispatch(playVideo({ video: q, addToQueue: true }));
      });
    }

    dispatch(setPanelExpanded(true));
  };

  const handlePlayAll = () => {
    if (playlist?.items && playlist.items.length > 0) {
      dispatch(clearQueue());

      const firstVideo: VideoItem = {
        id: playlist.items[0].id,
        title: playlist.items[0].title,
        thumbnail: playlist.items[0].thumbnail,
        channelTitle: playlist.items[0].videoOwnerChannelTitle,
        publishedAt: playlist.items[0].publishedAt,
        durationSeconds: playlist.items[0].durationSeconds,
        resourceId: playlist.items[0].resourceId,
      };

      // 첫 번째 비디오를 재생하고 나머지를 대기열에 추가
      dispatch(playVideo({ video: firstVideo }));

      // 나머지 비디오들을 대기열에 추가
      const restItems = playlist.items.slice(1);
      restItems.forEach((item) => {
        const videoItem: VideoItem = {
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          channelTitle: item.videoOwnerChannelTitle,
          publishedAt: item.publishedAt,
          durationSeconds: item.durationSeconds,
          resourceId: item.resourceId,
        };
        dispatch(playVideo({ video: videoItem, addToQueue: true }));
      });

      // Save play session for "play all" from beginning
      const nextItems = restItems.map((v) => v.id);
      saveSession({
        playlistId,
        nowPlayingItemId: firstVideo.id,
        startSeconds: 0,
        prevItems: [],
        nextItems,
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError || !playlist)
    return (
      <ErrorMessage message="플레이리스트를 불러오는 중 오류가 발생했습니다." />
    );

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#9eb8a8] hover:text-white mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" /> 뒤로가기
      </button>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Playlist info */}
        <div className="lg:w-4/12 w-full bg-gray-800 rounded-lg p-6 flex flex-col items-center text-center">
          <img
            src={playlist.thumbnail}
            alt={playlist.title}
            className="w-full h-auto max-h-56 object-cover rounded mb-6"
          />
          <h1 className="text-2xl font-bold text-white mb-4">
            {playlist.title}
          </h1>
          <div className="flex items-center justify-center flex-wrap gap-2 text-[#9eb8a8] mb-4 text-sm">
            <span>{playlist.channelTitle}</span>
            <span>•</span>
            <span>{playlist.itemCount}개 동영상</span>
            <span>•</span>
            <span>{formatDate(playlist.publishedAt)}</span>
          </div>
          {playlist.description && (
            <p className="text-[#9eb8a8] text-sm mb-6 line-clamp-6">
              {playlist.description}
            </p>
          )}
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold w-full justify-center"
          >
            <PlayIcon className="h-5 w-5" /> 전체 재생
          </button>
        </div>

        {/* Right: Video list */}
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white mb-4">동영상 목록</h2>
          {playlist.items && playlist.items.length > 0 ? (
            <div className="space-y-3">
              {playlist.items.map((item: MediaItem) => (
                <div
                  key={item.id}
                  onClick={() => handleVideoClick(item)}
                  className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-70 rounded-full p-1">
                        <PlayIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-[#9eb8a8] text-sm mb-1">
                      {item.videoOwnerChannelTitle}
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
    </div>
  );
}
