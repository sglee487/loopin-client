import React, {useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch} from '../../application/store/configureStore';
import {loadPlaylistById} from '../../application/actions/playItemActions';
import {
    backToPrev,
    CurrentPlayMapRootState,
    playSelectedPlayItem
} from '../../application/reducers/currentPlayMapReducer';
import NowPlayingItemComponent from "../components/playlist/NowPlayingItemComponent.tsx";
import QueueComponent from "../components/playlist/QueueComponent.tsx";
import {PlayItem} from "../../domain/entities/PlayItem.ts";

const PlaylistContainer: React.FC = () => {
    const {id: playlistId} = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {CurrentPlayMap, loading, error} = useSelector((state: CurrentPlayMapRootState) => state.currentPlayMap);

    useEffect(() => {
        if (playlistId) {
            dispatch(loadPlaylistById(playlistId));
        }
    }, [dispatch, playlistId]);

    if (loading) return <div className="flex justify-center p-8">Loading...</div>;
    if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>;
    if (!playlistId || !CurrentPlayMap.has(playlistId)) return <div className="flex justify-center p-8">Playlist not
        found</div>;

    console.log(CurrentPlayMap);
    const currentPlay = CurrentPlayMap.get(playlistId)!;
    console.log('currentPlay', currentPlay);

    const handleBack = () => {
        navigate(-1);
    };

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
                onClick={handleBack}
                className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
            >
                ← Back
            </button>

            <div className="rounded-lg shadow-lg overflow-hidden">

                <NowPlayingItemComponent playlistId={playlistId} nowPlayingItem={currentPlay.nowPlayingItem} prevQueue={prevQueue}
                                         nextQueue={nextQueue} key={playlistId}/>

                <div className="flex">
                    <QueueComponent name='이전' playItems={currentPlay.prev}
                                    total={currentPlay.playlist.items?.length || 0} reverse={true}
                                    selectPlayItem={selectedPlayItem}/>
                    <QueueComponent name='다음' playItems={currentPlay.next}
                                    total={currentPlay.playlist.items?.length || 0} selectPlayItem={selectedPlayItem}/>
                </div>

            </div>
        </div>
    );
};

export default PlaylistContainer;
  