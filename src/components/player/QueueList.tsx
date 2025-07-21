import React from "react";
import type { VideoItem } from "@/features/player/types";

interface QueueListProps {
  title: string;
  videos: VideoItem[];
  emptyMessage?: string;
  onSelect?: (video: VideoItem) => void;
}

const QueueList: React.FC<QueueListProps> = ({
  title,
  videos,
  emptyMessage,
  onSelect,
}) => {
  return (
    <div className="flex-1 min-w-0">
      <h3 className="text-gray-400 text-sm font-semibold mb-4">{title}</h3>
      {videos.length === 0 ? (
        <p className="text-gray-500 text-xs">
          {emptyMessage || "대기열이 비어 있습니다."}
        </p>
      ) : (
        <ul className="space-y-2">
          {videos.map((video: VideoItem, idx: number) => (
            <li
              key={video.id}
              className={`flex gap-3 items-center ${
                onSelect ? "cursor-pointer hover:bg-gray-800" : ""
              } rounded px-2 py-1`}
              onClick={onSelect ? () => onSelect(video) : undefined}
            >
              <span className="text-xs text-gray-500 w-4 flex-shrink-0">
                {idx + 1}
              </span>
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-12 h-8 object-cover rounded flex-shrink-0"
              />
              <span className="text-sm text-white truncate min-w-0">
                {video.title}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QueueList;
