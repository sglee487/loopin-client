import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@application/store/configureStore';
import PlaylistSingleComponent from '@presentation/components/PlaylistSingleComponent.tsx';
import CurrentPlaySingleComponent from '@presentation/components/CurrentPlaySingleComponent.tsx';
import { loadPlaylists } from '@application/actions/playlistActions.ts';
import { Playlist } from '@domain/entities/Playlist';
import { PlaylistsRootState } from '@application/reducers/playlistsReducer.ts';
import { CurrentPlayMapRootState } from '@application/reducers/currentPlayMapReducer.ts';
import { pullCurrentPlayMap } from '@application/actions/currentPlayMapActions.ts';

const PlaylistsContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Get playlists state
  const { playlists, loading: playlistsLoading, error: playlistsError } = useSelector(
    (state: PlaylistsRootState) => state.playlists
  );
  // Get current play map state
  const { currentPlayMap, loading: currentPlayLoading, error: currentPlayError } = useSelector(
    (state: CurrentPlayMapRootState) => state.currentPlayMap
  );

  useEffect(() => {
    dispatch(loadPlaylists());
    dispatch(pullCurrentPlayMap());
  }, [dispatch]);

  // Handle loading state
  if (currentPlayLoading || playlistsLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  // console.error('errorC', errorC);
  // console.error('errorP', errorP);

  // 에러 처리
  // if (errorC || errorP) {
  //   return (
  //     <div className="flex justify-center p-8">
  //       Error: {errorC || errorP}
  //     </div>
  //   );
  // }

  // Handle playlists not available
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
          .filter((playlist: Playlist) => (currentPlayMap[playlist.playlistId] === undefined))
          .map((playlist: Playlist) => (
            <PlaylistSingleComponent key={playlist.playlistId} playlist={playlist} />
          ))}
      </div>
    </div>
  );
};

export default PlaylistsContainer;
