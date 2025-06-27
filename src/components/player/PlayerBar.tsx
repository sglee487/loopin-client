import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import {
  pauseVideo,
  resumeVideo,
  nextVideo,
  previousVideo,
  updateCurrentTime,
  updateVolume,
} from "@/features/player/playerSlice";
import type { VideoItem } from "@/features/player/types";
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import { formatDuration } from "@/lib/utils";
import "./PlayerBar.css";

export default function PlayerBar() {
  const dispatch = useDispatch();
  const {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    history: historyList,
  } = useSelector((state: RootState) => state.player);

  console.log("PlayerBar state:", {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    historyList,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentVideo) {
    return null;
  }

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pauseVideo());
    } else {
      dispatch(resumeVideo());
    }
  };

  const handleNext = () => {
    dispatch(nextVideo());
  };

  const handlePrevious = () => {
    dispatch(previousVideo());
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    dispatch(updateCurrentTime(newTime));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    dispatch(updateVolume(newVolume));
  };

  const toggleMute = () => {
    dispatch(updateVolume(volume > 0 ? 0 : 1));
  };

  return (
    <>
      {/* Expandable panel */}
      {isExpanded && (
        <div className="fixed bottom-20 left-0 right-0 max-h-[60vh] bg-gray-800 border-t border-gray-700 overflow-y-auto z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-6">
            {/* 이전 목록 */}
            {historyList.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-2">
                  이전 재생목록
                </h3>
                <ul className="space-y-2">
                  {historyList.map((video: VideoItem, idx: number) => (
                    <li key={video.id} className="flex gap-3 items-center">
                      <span className="text-xs text-gray-500 w-4">
                        {idx + 1}
                      </span>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <span className="text-sm text-white truncate flex-1">
                        {video.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 다음 목록 */}
            {queue.length > 0 && (
              <div>
                <h3 className="text-gray-400 text-sm font-semibold mb-2">
                  다음 재생목록
                </h3>
                <ul className="space-y-2">
                  {queue.map((video: VideoItem, idx: number) => (
                    <li key={video.id} className="flex gap-3 items-center">
                      <span className="text-xs text-gray-500 w-4">
                        {idx + 1}
                      </span>
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-12 h-8 object-cover rounded"
                      />
                      <span className="text-sm text-white truncate flex-1">
                        {video.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player bar (with handle) */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
        {/* Handle */}
        <div
          className="flex justify-center cursor-pointer bg-gray-800"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronUpIcon className="h-5 w-5 text-gray-400" />
          )}
        </div>

        <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
          {/* 왼쪽: 비디오 정보 */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              className="w-12 h-12 object-cover rounded"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-white font-medium text-sm truncate">
                {currentVideo.title}
              </h3>
              <p className="text-gray-400 text-xs truncate">
                {currentVideo.channelTitle}
              </p>
            </div>
          </div>

          {/* 중앙: 재생 컨트롤 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <BackwardIcon className="h-5 w-5" />
            </button>

            <button
              onClick={handlePlayPause}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <PauseIcon className="h-5 w-5" />
              ) : (
                <PlayIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ForwardIcon className="h-5 w-5" />
            </button>
          </div>

          {/* 오른쪽: 볼륨 및 진행률 */}
          <div className="flex items-center gap-4 flex-1 justify-end">
            {/* 진행률 표시 */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{formatDuration(currentTime)}</span>
              <div className="w-32">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleTimeChange}
                  className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer player-slider"
                />
              </div>
              <span>{formatDuration(duration)}</span>
            </div>

            {/* 볼륨 컨트롤 */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {volume > 0 ? (
                  <SpeakerWaveIcon className="h-4 w-4" />
                ) : (
                  <SpeakerXMarkIcon className="h-4 w-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer player-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
