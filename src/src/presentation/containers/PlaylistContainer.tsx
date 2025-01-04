import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../../application/store/configureStore';
import { loadPlaylistById } from '../../application/actions/playItemActions';
import { CurrentPlayMapRootState } from '../../application/reducers/currentPlayMapReducer';

const PlaylistContainer: React.FC = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { CurrentPlayMap, loading, error } = useSelector((state: CurrentPlayMapRootState) => state.currentPlayMap);

  useEffect(() => {
    if (playlistId) {
      dispatch(loadPlaylistById(playlistId));
    }
  }, [dispatch, playlistId]);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="flex justify-center p-8 text-red-500">Error: {error}</div>;
  if (!playlistId || !CurrentPlayMap.has(playlistId)) return <div className="flex justify-center p-8">Playlist not found</div>;

  const currentPlay = CurrentPlayMap.get(playlistId)!;
  const playlist = currentPlay.playlist;

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto p-4">
      <button 
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center"
      >
        ← Back
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-96">
          <img 
            src={playlist.thumbnail} 
            alt={playlist.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white mb-2">{playlist.title}</h1>
            <div className="text-white/80">{playlist.channelTitle}</div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>Channel ID: {playlist.channelId}</span>
            </div>
            <time>Published: {playlist.publishedAt.toLocaleDateString()}</time>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {playlist.description || 'No description available'}
            </p>
          </div>

          {/* {playlist.videoOwnerChannelTitle && (
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Video Owner</h2>
              <p className="text-gray-700">
                Channel: {playlist.videoOwnerChannelTitle}
                {playlist.videoOwnerChannelId && (
                  <span className="text-sm text-gray-500 ml-2">
                    (ID: {playlist.videoOwnerChannelId})
                  </span>
                )}
              </p>
            </div>
          )}

          {playlist.resource && (
            <div className="border-t pt-4">
              <h2 className="text-xl font-semibold mb-2">Resource Information</h2>
              <div className="text-gray-700">
                <p>Type: {playlist.resource.kind}</p>
                <p>Video ID: {playlist.resource.videoId}</p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default PlaylistContainer;
  