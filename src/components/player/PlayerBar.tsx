import { Fragment, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import PlayerControlsBar from "./PlayerControlsBar";
import "./PlayerBar.css";
import ReactPlayer from "react-player/youtube";
import VideoInfo from "./VideoInfo";
import QueueList from "./QueueList";
import {
  setPanelExpanded,
  nextVideo,
  playVideo,
  removeFromQueue,
  removeFromHistory,
  updateCurrentTime,
  updateDuration,
  pauseVideo,
  resumeVideo,
  updateVolume,
} from "@/features/player/playerSlice";
import { Transition } from "@headlessui/react";
import {
  useSaveSessionMutation,
  useUpdateStartSecondsMutation,
} from "@/features/player/api/playSessionApi";

export default function PlayerBar() {
  const { currentVideo, isPlaying, currentTime, volume, queue, history } =
    useSelector((state: RootState) => state.player);

  const isExpanded = useSelector(
    (state: RootState) => state.player.panelExpanded
  );

  const currentPlaylistId = useSelector(
    (state: RootState) => state.player.currentPlaylistId
  );

  const dispatch = useDispatch();

  // Mutations for session updates
  const [saveSession] = useSaveSessionMutation();
  const [updateStartSeconds] = useUpdateStartSecondsMutation();

  const playerRef = useRef<ReactPlayer>(null);

  const handleProgress = useCallback(
    ({ playedSeconds }: { playedSeconds: number }) => {
      const secs = Math.floor(playedSeconds);
      dispatch(updateCurrentTime(secs));

      if (currentPlaylistId == null) return;

      // 5초마다 한번씩 재생시간 동기화
      if (secs > 0 && secs % 5 === 0) {
        updateStartSeconds({
          playlistId: currentPlaylistId,
          startSeconds: secs,
        });
      }

      // Sync volume from the underlying YouTube player when user changes it via native controls
      if (playerRef.current) {
        // For YouTube, getInternalPlayer returns the YT player instance that has getVolume (0-100)
        const internal: any = (playerRef.current as any).getInternalPlayer?.();
        if (internal && typeof internal.getVolume === "function") {
          const volRaw: number = internal.getVolume();
          if (typeof volRaw === "number") {
            const volNorm = Math.round(volRaw) / 100; // 0-1 range
            // Only dispatch if changed to avoid excessive updates
            if (Math.abs(volNorm - volume) > 0.01) {
              dispatch(updateVolume(volNorm));
            }
          }
        }
      }
    },
    [currentPlaylistId, dispatch, updateStartSeconds, volume]
  );

  // Save session whenever a new video starts playing
  const handleStart = useCallback(() => {
    if (!currentVideo || currentPlaylistId == null) return;

    const prevIds = [...history].reverse().map((v) => v.id);
    const nextIds = queue.map((v) => v.id);

    saveSession({
      playlistId: currentPlaylistId,
      nowPlayingItemId: currentVideo.id,
      startSeconds: 0,
      prevItems: prevIds,
      nextItems: nextIds,
    });
  }, [currentVideo?.id, currentPlaylistId, history, queue, saveSession]);

  const handleReady = useCallback(() => {
    if (playerRef.current && currentTime > 0) {
      playerRef.current.seekTo(currentTime, "seconds");
    }
  }, [currentTime]);

  const handleSeek = useCallback(
    (seconds: number) => {
      if (playerRef.current) {
        playerRef.current.seekTo(seconds, "seconds");
        dispatch(updateCurrentTime(seconds));
      }
    },
    [dispatch]
  );

  const handleDuration = useCallback(
    (dur: number) => {
      dispatch(updateDuration(Math.floor(dur)));
    },
    [dispatch]
  );

  // Handler when selecting a video from the upcoming queue
  const selectFromQueue = (video: (typeof queue)[number]) => {
    dispatch(removeFromQueue(video.id));
    dispatch(playVideo({ video }));
  };

  // Handler when selecting a video from the history list
  const selectFromHistory = (video: (typeof history)[number]) => {
    dispatch(removeFromHistory(video.id));
    dispatch(playVideo({ video }));
  };

  // If user pauses/plays via the embedded player controls, sync to global state
  const handlePlay = useCallback(() => {
    dispatch(resumeVideo());
  }, [dispatch]);

  const handlePause = useCallback(() => {
    dispatch(pauseVideo());
  }, [dispatch]);

  return (
    <>
      {/* Render mini/expanded player UI only when a video is loaded */}
      {currentVideo && (
        <>
          {/* Backdrop overlay when expanded */}
          {isExpanded && (
            <div
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => dispatch(setPanelExpanded(false))}
            />
          )}

          {/* Collapsed mini view (thumbnail only to avoid double audio) */}
          {!isExpanded && (
            <div
              className="absolute left-4 bottom-4 z-30 flex items-end gap-2 cursor-pointer"
              onClick={() => dispatch(setPanelExpanded(true))}
            >
              <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title}
                className="w-24 h-14 object-cover rounded"
              />
              <div className="text-white text-xs line-clamp-2 max-w-[120px]">
                {currentVideo.title}
              </div>
            </div>
          )}

          {/* Expanded panel with slide animation */}
          <Transition
            show={isExpanded}
            unmount={false}
            as={Fragment}
            enter="transform transition-transform duration-300 ease-out"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transform transition-transform duration-300 ease-in"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <div className="fixed bottom-[92px] h-8/10 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 rounded-t-lg p-6">
              <div className="flex h-full gap-6 px-4 sm:px-6 lg:px-8">
                <div className="flex-shrink-0 w-[440px]">
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${currentVideo.resourceId}`}
                    playing={isPlaying}
                    controls
                    volume={volume}
                    width="440px"
                    height="360px"
                    style={{ borderRadius: "8px" }}
                    className="z-50"
                    ref={playerRef}
                    onEnded={() => dispatch(nextVideo())}
                    onReady={handleReady}
                    onStart={handleStart}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onSeek={handleSeek}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    progressInterval={1000}
                  />
                  <VideoInfo video={currentVideo} />
                </div>

                <div className="flex-1 flex gap-6 min-w-0">
                  <QueueList
                    title="이전 재생목록"
                    videos={history}
                    onSelect={selectFromHistory}
                  />
                  <QueueList
                    title="다음 재생목록"
                    videos={queue}
                    onSelect={selectFromQueue}
                  />
                </div>
              </div>
            </div>
          </Transition>
        </>
      )}

      {/* Player bar controls (always visible, shows placeholder if no video) */}
      <PlayerControlsBar playerRef={playerRef} />
    </>
  );
}
