import React, { useEffect, useState } from "react";
import { PlayItem } from "../../../domain/entities/PlayItem.ts";
import { ArrowPathIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, PlayPauseIcon, } from "@heroicons/react/16/solid";
import ReactPlayer from "react-player";
import { setStartSeconds } from "../../../application/reducers/currentPlayMapReducer.ts";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../application/store/configureStore.ts";

interface NowPlayingItemComponentProps {
    playlistId: string;
    nowPlayingItem: PlayItem | undefined;
    prevQueue: () => void;
    nextQueue: () => void;
}

const NowPlayingItemComponent: React.FC<NowPlayingItemComponentProps> = ({ playlistId, nowPlayingItem, prevQueue, nextQueue }) => {
    const [playing, setPlaying] = useState(true);

    return (
        <div className="flex flex-col">
            <div>
                <NowPlayItemPlayer playlistId={playlistId} nowPlayingItem={nowPlayingItem} nextQueue={nextQueue} playing={playing} />
            </div>
            <div className="flex flex-col justify-end p-2">
                <div className="flex space-x-1">
                    <ChevronDoubleLeftIcon
                        className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                        onClick={prevQueue}
                    />
                    <PlayPauseIcon
                        className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                        onClick={() => setPlaying(!playing)}
                    >
                    </PlayPauseIcon>
                    <ChevronDoubleRightIcon
                        className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                        onClick={nextQueue}
                    />
                    <div className="grow"></div>
                    <ArrowPathIcon
                        className="inline-block h-10 w-10 cursor-pointer place-self-end p-2 hover:bg-slate-200"
                    />
                </div>
            </div>
        </div>
    )
}


export default NowPlayingItemComponent;

interface NowPlayItemPlayerProps {
    playlistId: string;
    nowPlayingItem: PlayItem | undefined;
    nextQueue: () => void;
    playing: boolean;
}
const NowPlayItemPlayer: React.FC<NowPlayItemPlayerProps> = ({ playlistId, nowPlayingItem, nextQueue, playing }) => {

    const dispatch = useDispatch<AppDispatch>();

    const _onError = () => {
        console.error("Error on playing video");
        nextQueue();
    };

    const _youtubePlayerCallback = (e: {
        played: number;
        playedSeconds: number;
        loaded: number;
        loadedSeconds: number;
    }) => {
        try {
            if (nowPlayingItem === undefined) {
                return
            }
            dispatch(
                setStartSeconds({
                    playlistId: playlistId,
                    startSeconds: e.playedSeconds,
                })
            )
        } catch (e) {
            console.error(e);
        }
    };

    // prevent too fast run before rendering when nowPlayingItem is undefined
    useEffect(() => {
        if (!nowPlayingItem) {
            nextQueue();
        }
    }, [nowPlayingItem, nextQueue]);

    if (!nowPlayingItem) {
        return (
            <div>
                PlayItem is empty or loading...
            </div>
        )
    }

    return (
        <div className="flex space-x-2">
            <div className="flex-none rounded-md bg-purple-200 p-2">
                {
                    <ReactPlayer
                        width="350px"
                        height="240px"
                        playing={playing}
                        config={{
                            youtube: {
                                playerVars: {
                                    start: Math.trunc(
                                        nowPlayingItem.startSeconds
                                    ),
                                },
                            },
                        }}
                        controls={true}
                        onProgress={_youtubePlayerCallback}
                        onEnded={nextQueue}
                        onError={_onError}
                        progressInterval={5000}
                        stopOnUnmount={false}
                        url={`https://www.youtube.com/watch?v=${nowPlayingItem.resource.videoId}`}
                    />
                }
            </div>
            <div className="grow flex flex-col justify-end h-[244px] overflow-y-scroll">
                {/* <ArrowTopRightOnSquareIcon className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200" /> */}
                <h2 className="line-clamp-2">
                    {nowPlayingItem.title}
                </h2>
                <h4>{nowPlayingItem.videoOwnerChannelTitle}</h4>
                <div className="my-1 border-b border-transparent"></div>
                <div className="line-clamp-4">
                    {nowPlayingItem.description}
                </div>
            </div>
        </div>
    )
}