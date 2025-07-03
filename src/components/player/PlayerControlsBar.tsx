import React from "react";
import type ReactPlayer from "react-player/youtube";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import {
  pauseVideo,
  resumeVideo,
  nextVideo,
  previousVideo,
  updateCurrentTime,
  updateVolume,
  togglePanel,
} from "@/features/player/playerSlice";
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

interface PlayerControlsBarProps {
  playerRef: React.RefObject<ReactPlayer>;
}

export default function PlayerControlsBar({
  playerRef,
}: PlayerControlsBarProps) {
  const dispatch = useDispatch();
  const { currentVideo, isPlaying, currentTime, duration, volume } =
    useSelector((state: RootState) => state.player);

  const isExpanded = useSelector(
    (state: RootState) => state.player.panelExpanded
  );

  const toggleExpand = () => dispatch(togglePanel());

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pauseVideo());
    } else {
      dispatch(resumeVideo());
    }
  };

  const handleNext = () => dispatch(nextVideo());
  const handlePrevious = () => dispatch(previousVideo());
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    // Seek the actual player
    if (playerRef.current) {
      playerRef.current.seekTo(newTime, "seconds");
    }
    // Update global state so UI reflects new time
    dispatch(updateCurrentTime(newTime));
  };
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    dispatch(updateVolume(newVol));
  };
  const toggleMute = () => dispatch(updateVolume(volume > 0 ? 0 : 1));

  if (!currentVideo) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      {/* Handle to toggle expanded panel */}
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
        {/* Left: video thumbnail and info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div
            className="flex items-center gap-3 cursor-pointer px-2 rounded-md"
            onClick={toggleExpand}
          >
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
        </div>

        {/* Center: playback controls */}
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

        {/* Right: progress & volume */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {/* Progress */}
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

          {/* Volume */}
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
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer player-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
