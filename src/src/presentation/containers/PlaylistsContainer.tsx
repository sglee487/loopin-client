import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../application/store/configureStore';
import PlaylistsSingleComponent from '../components/PlaylistsSingleComponent.tsx';
import { loadPlaylists } from '../../application/actions/playItemActions';
import { Playlist } from '../../domain/entities/Playlist';
import { PlaylistsRootState } from '../../application/reducers/playlistsReducer.ts';

const PlaylistsContainer: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { playlists, loading, error } = useSelector((state: PlaylistsRootState) => state.playlists);

  useEffect(() => {
    dispatch(loadPlaylists());
  }, [dispatch]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (playlists.length === 0) return <div className="flex justify-center p-8">No playlists</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {playlists.map((item: Playlist) => (
          <PlaylistsSingleComponent key={item.playlistId} item={item} />
        ))}
      </div>
    </div>
  );
};

export default PlaylistsContainer;
