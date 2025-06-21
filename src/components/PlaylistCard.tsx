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
    // <div
    //   className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg dark:bg-gray-800"
    //   onClick={() => navigate(`/playlists/${playlist.id}`)}
    // >
    //   {/* 썸네일 */}
    //   {playlist.thumbnail && (
    //     <img
    //       src={playlist.thumbnail}
    //       alt={playlist.title}
    //       className="h-48 w-full object-cover transition-transform group-hover:scale-105"
    //       loading="lazy"
    //     />
    //   )}

    //   {/* 제목 및 채널 */}
    //   <div className="p-4">
    //     <h3 className="mb-1 line-clamp-2 font-semibold">
    //       {playlist.title}
    //     </h3>
    //     <p className="text-sm text-gray-500 dark:text-gray-400">
    //       {playlist.channelTitle}
    //     </p>
    //   </div>
    // </div>
    <div className="flex flex-col justify-start items-start w-80 relative overflow-hidden gap-4">
      <div className="w-40 h-40 bg-blue-500 border-2 border-red-400 rounded-lg">
        <p className="text-white">Relative parent</p>

        <div className="absolute bottom-0 left-0 bg-green-500 p-2">
          <p className="text-white">Absolute child</p>
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
