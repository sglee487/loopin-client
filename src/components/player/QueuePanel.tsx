import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import { removeFromQueue } from "@/features/player/playerSlice";
import { formatDuration } from "@/lib/utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { VideoItem } from "@/features/player/types";

export default function QueuePanel() {
  const dispatch = useDispatch();
  const { currentVideo, queue } = useSelector(
    (state: RootState) => state.player
  );

  const handleRemoveFromQueue = (videoId: number) => {
    dispatch(removeFromQueue(videoId));
  };

  if (!currentVideo && queue.length === 0) {
    return null;
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-700 overflow-y-auto z-40">
      <div className="p-4">
        <h2 className="text-white font-semibold text-lg mb-4">재생 대기열</h2>

        {/* 현재 재생 중인 비디오 */}
        {currentVideo && (
          <div className="mb-6">
            <h3 className="text-gray-400 text-sm font-medium mb-3">
              현재 재생 중
            </h3>
            <div className="bg-gray-800 rounded-lg p-3">
              <div className="flex gap-3">
                <img
                  src={currentVideo.thumbnail}
                  alt={currentVideo.title}
                  className="w-16 h-12 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                    {currentVideo.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-1">
                    {currentVideo.channelTitle}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {formatDuration(currentVideo.durationSeconds)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 대기열 */}
        {queue.length > 0 && (
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-3">
              대기열 ({queue.length})
            </h3>
            <div className="space-y-2">
              {queue.map((video: VideoItem, index: number) => (
                <div
                  key={video.id}
                  className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm line-clamp-2 mb-1">
                        {video.title}
                      </h4>
                      <p className="text-gray-400 text-xs mb-1">
                        {video.channelTitle}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDuration(video.durationSeconds)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveFromQueue(video.id)}
                      className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
