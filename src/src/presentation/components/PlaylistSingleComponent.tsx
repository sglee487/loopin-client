// src/presentation/components/PlayItemComponent.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Playlist } from '../../domain/entities/Playlist';

interface PlaylistsSingleComponentProps {
  item: Playlist;
}

const PlaylistsSingleComponent: React.FC<PlaylistsSingleComponentProps> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/playlist/${item.playlistId}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-stone-100 dark:bg-stone-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
        <img
          src={item.thumbnail}
          alt={item.title}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{item.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{item.description}</p>
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{item.channelTitle}</span>
          <time>{item.publishedAt.toLocaleDateString()}</time>
        </div>
      </div>
    </div>
  );
};

export default PlaylistsSingleComponent;
