import React from "react";
import { useNavigate } from "react-router-dom";
import type { MediaPlaylist } from "@/types/media/index";
import { QueueListIcon } from "@heroicons/react/24/outline";

interface PlaylistCardProps {
  playlist: MediaPlaylist;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-start items-start relative overflow-hidden gap-2">
      <div className="relative w-full aspect-video overflow-hidden">
        <img
          src={playlist.thumbnail}
          className="w-full h-full object-cover object-center rounded-lg"
          alt={playlist.title}
        />
        {/* Item count indicator */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <QueueListIcon className="h-3 w-3" />
          323
        </div>
      </div>

      <div className="flex flex-col justify-start items-start self-stretch flex-grow gap-1">
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
          <p className="self-stretch flex-grow-0 flex-shrink-0 w-80 text-base font-bold text-left text-white">
            {playlist.title}
          </p>
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
          <p className="self-stretch flex-grow-0 flex-shrink-0 w-80 text-sm text-left text-[#9eb8a8]">
            {playlist.description ?? "No description"}
          </p>
        </div>
        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 relative">
          <p className="self-stretch flex-grow-0 flex-shrink-0 w-80 text-sm text-left text-[#9eb8a8]">
            {playlist.channelTitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
