import React, { useRef, useEffect } from "react";
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
  shuffleQueue,
  toggleLoop,
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
  ArrowPathIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/solid";
import { formatDuration } from "@/lib/utils";
import { useSaveSessionMutation } from "@/features/player/api/playSessionApi";

interface PlayerControlsBarProps {
  playerRef: React.RefObject<ReactPlayer>;
}

export default function PlayerControlsBar({
  playerRef,
}: PlayerControlsBarProps) {
  const dispatch = useDispatch();
  const {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    loopEnabled,
    queue,
    history,
    currentPlaylistId,
  } = useSelector((state: RootState) => state.player);

  // Remember the last non-zero volume to restore after unmuting
  const lastVolumeRef = useRef(volume);

  // Keep the reference up-to-date whenever volume changes (and is not muted)
  useEffect(() => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
    }
  }, [volume]);

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
  const [saveSession] = useSaveSessionMutation();

  const handleShuffle = () => {
    // Create shuffled copy
    const shuffled = [...queue];
    if (shuffled.length > 1) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    }

    // Dispatch to store
    dispatch(shuffleQueue(shuffled));

    // Notify server of new order if playlist context exists
    if (currentVideo && typeof currentPlaylistId === "number") {
      const prevIds = [...history].reverse().map((v) => v.id);
      const nextIds = shuffled.map((v) => v.id);

      saveSession({
        playlistId: currentPlaylistId,
        nowPlayingItemId: currentVideo.id,
        startSeconds: 0, // keep current progress as 0 for reorder
        prevItems: prevIds,
        nextItems: nextIds,
      });
    }
  };

  const handleLoop = () => dispatch(toggleLoop());
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
    if (newVol > 0) {
      lastVolumeRef.current = newVol;
    }
    dispatch(updateVolume(newVol));
  };
  const toggleMute = () => {
    if (volume > 0) {
      // Mute and remember current volume
      lastVolumeRef.current = volume;
      dispatch(updateVolume(0));
    } else {
      // Restore to the previous volume (or 1 as a fallback)
      dispatch(updateVolume(lastVolumeRef.current || 1));
    }
  };

  // If no video is currently selected, render an empty (placeholder) player bar so that the
  // layout always reserves space for the controls area. This keeps the UI stable on first
  // load regardless of whether a video starts playing later.
  if (!currentVideo) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50 h-16" />
    );
  }

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

      <div className="px-4 py-3 flex items-center justify-between">
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
            <div className="min-w-0 flex-1 pr-2">
              <h3 className="text-white font-medium text-sm line-clamp-1 whitespace-normal">
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
          {/* Shuffle (one-time) */}
          <button
            onClick={handleShuffle}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
            title="Shuffle upcoming videos"
          >
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </button>

          <button
            onClick={handlePrevious}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <BackwardIcon className="h-5 w-5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform cursor-pointer"
          >
            {isPlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <PlayIcon className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ForwardIcon className="h-5 w-5" />
          </button>

          {/* Loop */}
          <button
            onClick={handleLoop}
            className={`transition-colors cursor-pointer ${
              loopEnabled ? "text-blue-500" : "text-gray-400 hover:text-white"
            }`}
            title="Repeat playlist"
          >
            <ArrowPathIcon className="h-5 w-5" />
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
              className="text-gray-400 hover:text-white transition-colors cursor-pointer"
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
