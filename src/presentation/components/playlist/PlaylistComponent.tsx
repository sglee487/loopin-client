import React from 'react';
import { CurrentPlay } from "@domain/entities/CurrentPlay.ts";

interface PlaylistBatchSingleComponentProps {
    currentPlay: CurrentPlay;
}

const PlaylistComponent: React.FC<PlaylistBatchSingleComponentProps> = ({ currentPlay }) => {

    return (
        <div
            className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
        >
            <div>
                {currentPlay.playlist.title}
            </div>
        </div>
    );
};

export default PlaylistComponent;
