import React from "react";
import { useDispatch } from "react-redux";
import { useGetSessionQuery } from "@/features/player/api/playSessionApi";
import type { PlaySession } from "@/features/player/api/playSessionApi";
import {
  loadSession,
  setPanelExpanded,
  playVideo,
  clearQueue,
} from "@/features/player/playerSlice";
import type { VideoItem } from "@/features/player/types";
import { QueueListIcon } from "@heroicons/react/24/outline";

interface SessionPlaylistCardProps {
  session: PlaySession;
}

const SessionPlaylistCard: React.FC<SessionPlaylistCardProps> = ({
  session,
}) => {
  const dispatch = useDispatch();

  // Fetch detailed session (includes prev/next items)
  const { data: sessionDetail } = useGetSessionQuery(
    session.playlist?.id ?? 0,
    {
      skip: !session.playlist?.id,
    }
  );

  const playlist = session.playlist;

  const handleClick = () => {
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

    if (sessionDetail && sessionDetail.nowPlaying) {
      const currentVid = toVideoItem(sessionDetail.nowPlaying);
      const prevArr: VideoItem[] =
        sessionDetail.prevItems?.map(toVideoItem) ?? [];
      const nextArr: VideoItem[] =
        sessionDetail.nextItems?.map(toVideoItem) ?? [];

      dispatch(
        loadSession({
          current: currentVid,
          prevItems: prevArr,
          nextItems: nextArr,
          startSeconds: sessionDetail.startSeconds,
        })
      );
    } else if (session.nowPlaying) {
      // Fallback: only nowPlaying available
      const fallbackVid = toVideoItem(session.nowPlaying);
      dispatch(clearQueue());
      dispatch(playVideo({ video: fallbackVid }));
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
        {/* Item count indicator */}
        <div className="absolute bottom-2 right-2 bg-black opacity-80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <QueueListIcon className="h-3 w-3" />
          {playlist.itemCount}
        </div>
        {/* (no overlay, mimic PlaylistCard) */}
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-white truncate">
          {playlist.title}
        </h3>
        <p className="text-sm text-[#9eb8a8] truncate">
          이어 듣기 • {playlist.channelTitle}
        </p>
      </div>
    </div>
  );
};

export default SessionPlaylistCard;
