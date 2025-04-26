import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@application/store/configureStore';
import { loadPlaylistById } from '@application/actions/playlistActions.ts';
import {
    backToPrev,
    CurrentPlayMapRootState,
    playSelectedPlayItem
} from '@/application/state/currentPlayMapReducer';
import { pullCurrentPlay } from '@application/actions/currentPlayMapActions.ts';
import NowPlayingItemComponent from "@presentation/components/playlist/NowPlayingItemComponent.tsx";
import QueueComponent from "@presentation/components/playlist/QueueComponent.tsx";
import { PlayItem } from "@domain/entities/PlayItem.ts";

const PlaylistContainer: React.FC = () => {
    const { id: playlistId } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { currentPlayMap, loading } = useSelector((state: CurrentPlayMapRootState) => state.currentPlayMap);

    useEffect(() => {
        if (playlistId) {
            dispatch(loadPlaylistById(playlistId));
            dispatch(pullCurrentPlay(playlistId))
        }
    }, [dispatch, playlistId]);

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    // if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>;

    if (!playlistId || (currentPlayMap[playlistId] === undefined)) return <div className="flex justify-center p-8">Playlist not
        found</div>;

    const currentPlay = currentPlayMap[playlistId]!;

    const handleHome = () => {
        navigate('/');
    }

    const prevQueue = () => {
        dispatch(
            backToPrev(
                {
                    playlistId: playlistId,
                    prevPlayItem: currentPlay.prev[currentPlay.prev.length - 1],
                })
        )
    }

    const nextQueue = () => {
        selectedPlayItem(
            currentPlay.next[0]
        )
    };

    const selectedPlayItem = (playItem: PlayItem) => {
        dispatch(
            playSelectedPlayItem({
                playlistId: playlistId,
                selectedPlayItem: playItem,
            })
        )
    }

    return (
        <div className="container mx-auto p-4">
            <button
                onClick={handleHome}
                className="mb-4 px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg flex items-center"
            >
                ← Home
            </button>

            <div className="rounded-lg shadow-lg overflow-hidden">

                <NowPlayingItemComponent playlistId={playlistId} nowPlayingItem={currentPlay.nowPlayingItem} prevQueue={prevQueue}
                    nextQueue={nextQueue} startSeconds={currentPlay.startSeconds} key={playlistId} />

                <div className="flex">
                    <QueueComponent name='이전' playlistId={playlistId} playItems={currentPlay.prev}
                        total={currentPlay.playlist.items?.length || 0} reverse={true}
                        selectPlayItem={selectedPlayItem} />
                    <QueueComponent name='다음' playlistId={playlistId} playItems={currentPlay.next}
                        total={currentPlay.playlist.items?.length || 0} selectPlayItem={selectedPlayItem} />
                </div>

            </div>
        </div>
    );
};

export default PlaylistContainer;
