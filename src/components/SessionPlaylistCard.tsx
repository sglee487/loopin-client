import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetSessionQuery } from "@/features/player/api/playSessionApi";
import type { PlaySession } from "@/features/player/api/playSessionApi";
import {
  loadSession,
  setPanelExpanded,
  playVideo,
  clearQueue,
  setCurrentPlaylistId,
  resumeVideo,
} from "@/features/player/playerSlice";
import type { VideoItem } from "@/features/player/types";
import { PlayIcon } from "@heroicons/react/24/outline";

interface SessionPlaylistCardProps {
  session: PlaySession;
}

const SessionPlaylistCard: React.FC<SessionPlaylistCardProps> = ({
  session,
}) => {
  const dispatch = useDispatch();

  // Currently playing playlist id from global state
  const currentPlaylistId = useSelector(
    (state: RootState) => state.player.currentPlaylistId
  );

  // Fetch detailed session (includes prev/next items)
  const { data: sessionDetail, refetch: refetchSessionDetail } =
    useGetSessionQuery(session.playlist?.id ?? 0, {
      skip: !session.playlist?.id,
    });

  const playlist = session.playlist;

  // Calculate how much of the current video has been watched (percentage)
  const durationSeconds =
    sessionDetail?.nowPlaying?.durationSeconds ??
    session.nowPlaying?.durationSeconds ??
    0;

  const startSeconds =
    sessionDetail?.startSeconds ??
    (typeof session.startSeconds === "number" ? session.startSeconds : 0);

  const progressPercent = durationSeconds
    ? Math.min(100, (startSeconds / durationSeconds) * 100)
    : 0;

  const handleClick = async () => {
    // 1) 이미 같은 세션을 듣고 있다면 패널만 열고(필요 시 재생 재개) 종료
    if (currentPlaylistId === playlist?.id) {
      dispatch(setPanelExpanded(true));
      dispatch(resumeVideo());
      return;
    }

    // 2) 클릭 순간마다 세션 정보를 최신으로 갱신
    let detail = sessionDetail;
    try {
      const res = await refetchSessionDetail();
      if ("data" in res && res.data) {
        detail = res.data;
      }
    } catch {
      /* 네트워크 오류 시 기존 캐시 사용 */
    }

    // helper convert
    const toVideoItem = (
      mi: import("@/features/playlists/types").MediaItem
    ): VideoItem => ({
      id: mi.id,
      title: mi.title,
      thumbnail: mi.thumbnail,
      channelTitle: mi.videoOwnerChannelTitle ?? "",
      publishedAt: mi.publishedAt,
      durationSeconds: mi.durationSeconds,
      resourceId: mi.resourceId,
    });

    if (detail && detail.nowPlaying) {
      const currentVid = toVideoItem(detail.nowPlaying);
      const prevArr: VideoItem[] = detail.prevItems?.map(toVideoItem) ?? [];
      const nextArr: VideoItem[] = detail.nextItems?.map(toVideoItem) ?? [];

      dispatch(
        loadSession({
          current: currentVid,
          prevItems: prevArr,
          nextItems: nextArr,
          startSeconds: detail.startSeconds,
          playlistId: playlist?.id,
        })
      );
      if (playlist?.id) {
        dispatch(setCurrentPlaylistId(playlist.id));
      }
    } else if (session.nowPlaying) {
      // Fallback: only nowPlaying available
      const fallbackVid = toVideoItem(session.nowPlaying);
      dispatch(clearQueue());
      dispatch(playVideo({ video: fallbackVid }));
      if (playlist?.id) {
        dispatch(setCurrentPlaylistId(playlist.id));
      }
    } else {
      return;
    }

    dispatch(setPanelExpanded(true));
  };

  if (!playlist) return null;

  return (
    <div
      className="flex flex-col gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={session.nowPlaying?.thumbnail}
          className="w-full h-full object-cover object-center rounded-lg"
          alt={`${playlist.title} thumbnail`}
        />
        {/* Watched / Total indicator */}
        <div className="absolute bottom-2 right-2 bg-black opacity-80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <PlayIcon className="h-3 w-3" />
          {(() => {
            // Calculate how many videos the user has watched
            let watched = 0;

            // Prefer the detailed session info if available
            const detail = sessionDetail ?? session;

            if (typeof detail.prevItemsLength === "number") {
              watched += detail.prevItemsLength;
            } else if (Array.isArray(detail.prevItems)) {
              watched += detail.prevItems.length;
            }

            // Count the currently playing video (if any) as watched
            if (detail.nowPlaying) {
              watched += 1;
            }

            return `${watched} / ${playlist.itemCount}`;
          })()}
        </div>
        {/* (no overlay, mimic PlaylistCard) */}

        {/* Progress bar indicating how much of the current video has been watched */}
        {durationSeconds > 0 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-neutral-700/70 dark:bg-neutral-600/70">
            <div
              className="h-full bg-red-600"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-brand truncate">
          {playlist.title}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
          이어 듣기 • {playlist.channelTitle}
        </p>
      </div>
    </div>
  );
};

export default SessionPlaylistCard;
