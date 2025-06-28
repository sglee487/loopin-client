import React from "react";
import type { VideoItem } from "@/features/player/types";

interface VideoInfoProps {
  video: VideoItem;
  className?: string;
}

/**
 * Displays video title and channel information with truncation.
 */
const VideoInfo: React.FC<VideoInfoProps> = ({ video, className = "" }) => {
  return (
    <div className={`mt-2 ${className}`}>
      <h2 className="text-white text-sm font-semibold wrap-break-word">
        {video.title}
      </h2>
      <p className="text-gray-400 text-xs wrap-break-word">
        {video.channelTitle}
      </p>
    </div>
  );
};

export default VideoInfo;
