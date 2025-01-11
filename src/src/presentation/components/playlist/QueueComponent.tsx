import React, { useMemo } from "react";

import { useDispatch } from 'react-redux';
import shuffleLogo from "../../../../assets/shuffle.svg";
import { PlayItem } from "../../../domain/entities/PlayItem.ts";
import { AppDispatch } from "../../../application/store/configureStore.ts";
import { shuffleNextQueue } from "../../../application/actions/currentPlayMapActions.ts";

interface QueueComponentProps {
    name: string;
    playlistId: string;
    playItems: PlayItem[];
    total: number;
    reverse?: boolean;
    selectPlayItem: (playItem: PlayItem) => void;
}

const QueueComponent: React.FC<QueueComponentProps> = ({ name, playlistId, playItems, total, reverse = false, selectPlayItem }) => {
    const dispatch = useDispatch<AppDispatch>();

    const _shuffleNextQueue = () => {
        dispatch(shuffleNextQueue(playlistId));
    }

    const renderPlayItems = useMemo(
        () => {
            if (reverse) {
                return playItems.slice().reverse() || []
            }
            return playItems
        },
        [playItems]
    );

    return (
        <div className="w-[360px] rounded-md border">
            <small>{name}</small>
            <div className="p-2 flex justify-between">
                <small className="text-gray-500">
                    {playItems.length} / {total}
                </small>
                <div>
                    {!reverse && <img
                        className="inline-block h-10 w-10 cursor-pointer p-2"
                        src={shuffleLogo}
                        onClick={() => _shuffleNextQueue()}
                    />}
                </div>
            </div>
            <div className="h-[460px] overflow-scroll">
                {renderPlayItems.map((item, index) => (
                    <PlayItemQueueCard key={index} playItem={item} index={index} onSelect={() => selectPlayItem(item)} />
                ))}
            </div>
        </div>
    )
}

export default QueueComponent

interface PlayItemQueueCardProps {
    playItem: PlayItem;
    index: number;
    onSelect: () => void;
}

const PlayItemQueueCard: React.FC<PlayItemQueueCardProps> = ({ playItem, index, onSelect }) => {

    return (
        <div className="flex cursor-pointer hover:bg-slate-200" onClick={onSelect}>
            <div className="w-8 flex-none self-center text-center text-sm">
                {index}
            </div>
            <img
                className="h-[56.25px] w-[100px] flex-none p-0.5"
                src={playItem.thumbnail}
                alt={playItem.title}
            />
            <div className="flex shrink flex-col">
                <p className="line-clamp-2">{playItem.title}</p>
                <p className="text-xs text-gray-500">
                    {playItem.videoOwnerChannelTitle}
                </p>
            </div>
        </div>
    )
}