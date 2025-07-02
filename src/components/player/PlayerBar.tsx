import { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store";
import PlayerControlsBar from "./PlayerControlsBar";
import "./PlayerBar.css";
import ReactPlayer from "react-player/youtube";
import VideoInfo from "./VideoInfo";
import QueueList from "./QueueList";
import { setPanelExpanded, nextVideo } from "@/features/player/playerSlice";
import { Transition } from "@headlessui/react";

export default function PlayerBar() {
  const {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
    history,
  } = useSelector((state: RootState) => state.player);

  const isExpanded = useSelector(
    (state: RootState) => state.player.panelExpanded
  );

  const dispatch = useDispatch();

  console.log("PlayerBar state:", {
    currentVideo,
    isPlaying,
    currentTime,
    duration,
    volume,
    queue,
  });

  if (!currentVideo) {
    return null;
  }

  return (
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
          <div className="flex h-full gap-6">
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
                onEnded={() => dispatch(nextVideo())}
              />
              <VideoInfo video={currentVideo} />
            </div>

            <div className="flex-1 flex gap-6 min-w-0">
              <QueueList title="이전 재생목록" videos={history} />
              <QueueList title="다음 재생목록" videos={queue} />
            </div>
          </div>
        </div>
      </Transition>

      {/* Player bar controls */}
      <PlayerControlsBar />
    </>
  );
}
