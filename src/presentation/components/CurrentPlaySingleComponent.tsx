import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentPlay } from '@domain/entities/CurrentPlay';
import { PlayIcon } from '@heroicons/react/24/outline';

interface CurrentPlaySingleComponentProps {
    currentPlay: CurrentPlay;
}

const CurrentPlaySingleComponent: React.FC<CurrentPlaySingleComponentProps> = ({ currentPlay }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/playlist/${currentPlay.playlist.playlistId}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-stone-100 dark:bg-stone-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        >
            <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
                <img
                    src={currentPlay.nowPlayingItem?.thumbnail}
                    alt={currentPlay.nowPlayingItem?.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <PlayIcon className="h-3 w-3" />
                    {currentPlay.prevItemCount + 1} / {currentPlay.playlist.contentDetails.itemCount}
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2 mb-2">{currentPlay.playlist.title}</h3>
                <p className="text-sm line-clamp-2 mb-2">{currentPlay.playlist.description}</p>
                <div className="flex justify-between items-center text-xs">
                    <span>{currentPlay.playlist.channelTitle}</span>
                    <time>{currentPlay.playlist.publishedAt.toLocaleDateString()}</time>
                </div>
            </div>
        </div>
    );
};

export default CurrentPlaySingleComponent;
