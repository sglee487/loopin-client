import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CurrentPlay } from '@domain/entities/CurrentPlay';
import { PlayIcon } from '@heroicons/react/24/outline';

/**
 * Props for the CurrentPlaySingleComponent
 * @interface CurrentPlaySingleComponentProps
 * @property {CurrentPlay} currentPlay - The current play state to display
 */
interface CurrentPlaySingleComponentProps {
    currentPlay: CurrentPlay;
}

/**
 * A component that displays a single currently playing playlist item.
 * Shows the playlist thumbnail, title, description, and progress information.
 * Clicking the component navigates to the playlist detail page.
 * 
 * @component
 * @param {CurrentPlaySingleComponentProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const CurrentPlaySingleComponent: React.FC<CurrentPlaySingleComponentProps> = ({ currentPlay }) => {
    const navigate = useNavigate();

    /**
     * Handles the click event on the component
     * Navigates to the playlist detail page
     */
    const handleClick = () => {
        navigate(`/playlist/${currentPlay.playlist.playlistId}`);
    };

    return (
        <div
            onClick={handleClick}
            className="bg-stone-100 dark:bg-stone-900 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        >
            {/* Thumbnail container with 16:9 aspect ratio */}
            <div className="relative pb-[56.25%]">
                <img
                    src={currentPlay.nowPlayingItem?.thumbnail}
                    alt={currentPlay.nowPlayingItem?.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {/* Progress indicator showing current position in playlist */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <PlayIcon className="h-3 w-3" />
                    {currentPlay.prevItemCount + 1} / {currentPlay.playlist.contentDetails.itemCount}
                </div>
            </div>
            {/* Playlist information */}
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
