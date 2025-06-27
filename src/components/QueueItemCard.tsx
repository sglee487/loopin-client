import React from "react";
import { useNavigate } from "react-router-dom";
import type { MediaPlaylist } from "@/features/playlists/types";
import { QueueListIcon } from "@heroicons/react/24/outline";

interface QueueItemCardProps {
  playlist: MediaPlaylist;
}

const QueueItemCard: React.FC<QueueItemCardProps> = ({ playlist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    // TODO: Navigate to playlist detail page
    // navigate(`/playlist/${playlist.id}`);
  };

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
          src={playlist.thumbnail}
          className="w-full h-full object-cover object-center rounded-lg"
          alt={`${playlist.title} thumbnail`}
        />
        {/* Item count indicator */}
        <div className="absolute bottom-2 right-2 bg-black opacity-80 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <QueueListIcon className="h-3 w-3" />
          {playlist.itemCount}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-white truncate">
          {playlist.title}
        </h3>
        <p className="text-sm text-[#9eb8a8] truncate">
          {playlist.description || "No description"}
        </p>
        <p className="text-sm text-[#9eb8a8]">{playlist.channelTitle}</p>
      </div>
    </div>
  );
};

export default QueueItemCard;
