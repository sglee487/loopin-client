import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import PlayerControlsBar from "./PlayerControlsBar";
import "./PlayerBar.css";
import ReactPlayer from "react-player/youtube";
import VideoInfo from "./VideoInfo";
import QueueList from "./QueueList";

export default function PlayerBar() {
  const { currentVideo, isPlaying, currentTime, duration, volume, queue } =
    useSelector((state: RootState) => state.player);

  const isExpanded = useSelector(
    (state: RootState) => state.player.panelExpanded
  );

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
      {/* ReactPlayer - stays mounted, repositioned via CSS */}
      <div
        className={
          isExpanded
            ? "fixed bottom-[92px] h-8/10 left-0 right-0 z-50 bg-gray-900 border-t border-gray-700 rounded-t-lg p-6"
            : "absolute left-4 bottom-4"
        }
      >
        <div className="flex h-full gap-6">
          {/* ReactPlayer - 항상 표시 */}
          <div className="flex-shrink-0 w-[440px]">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${currentVideo.resourceId}`}
              playing={isPlaying}
              controls
              volume={volume}
              width={isExpanded ? "440px" : "120px"}
              height={isExpanded ? "360px" : "20px"}
              style={{ borderRadius: "8px" }}
              className={isExpanded ? "z-50" : "fixed bottom-0"}
            />
            <VideoInfo video={currentVideo} />
          </div>

          {/* Expanded 상태일 때만 재생목록 표시 */}
          {isExpanded && (
            <div className="flex-1 flex gap-6 min-w-0">
              <QueueList title="이전 재생목록" videos={queue} />
              <QueueList title="다음 재생목록" videos={queue} />
            </div>
          )}
        </div>
      </div>

      {/* Player bar controls */}
      <PlayerControlsBar />
    </>
  );
}
