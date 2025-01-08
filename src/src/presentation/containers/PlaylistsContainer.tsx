import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../application/store/configureStore';
import PlaylistSingleComponent from '../components/PlaylistSingleComponent.tsx';
import CurrentPlaySingleComponent from '../components/CurrentPlaySingleComponent.tsx';
import { loadPlaylists } from '../../application/actions/playItemActions';
import { Playlist } from '../../domain/entities/Playlist';
import { PlaylistsRootState } from '../../application/reducers/playlistsReducer.ts';
import { CurrentPlayMapRootState } from '../../application/reducers/currentPlayMapReducer.ts';

const PlaylistsContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 상태 가져오기
  const { currentPlayMap, loading: loadingC, error: errorC } = useSelector(
    (state: CurrentPlayMapRootState) => state.currentPlayMap
  );
  const { playlists, loading: loadingP, error: errorP } = useSelector(
    (state: PlaylistsRootState) => state.playlists
  );

  useEffect(() => {
    dispatch(loadPlaylists());
  }, [dispatch]);

  // 로딩 상태 처리
  if (loadingC || loadingP) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  // 에러 처리
  if (errorC || errorP) {
    return (
      <div className="flex justify-center p-8">
        Error: {errorC || errorP}
      </div>
    );
  }

  // 플레이리스트가 없는 경우 처리
  if (!playlists || playlists.length === 0) {
    return <div className="flex justify-center p-8">No playlists available</div>;
  }

  // 렌더링
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-4xl font-bold">Current Playlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {
            Object.values(currentPlayMap).map((currentPlay) => (
                <CurrentPlaySingleComponent key={currentPlay.playlist.playlistId} currentPlay={currentPlay} />
            ))
          }
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists
          .filter((item: Playlist) => (currentPlayMap[item.playlistId] === undefined))
          .map((item: Playlist) => (
            <PlaylistSingleComponent key={item.playlistId} item={item} />
          ))}
      </div>
    </div>
  );
};

export default PlaylistsContainer;
