import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useGetStreamByIdQuery } from '../api/streamsApi';
import { getHLSMasterUrl } from '../api/streamsApi';
import HLSPlayer from '../components/HLSPlayer';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function StreamPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { data: stream, isLoading, error: apiError } = useGetStreamByIdQuery(id!);

  const handlePlayerError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handlePlayerReady = () => {
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading stream...</p>
        </div>
      </div>
    );
  }

  if (apiError || !stream) {
    return (
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/streams')}
          className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to streams</span>
        </button>

        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Stream not found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The requested stream could not be found or is no longer available
            </p>
          </div>
        </div>
      </div>
    );
  }

  const streamUrl = getHLSMasterUrl(stream.publicId);

  return (
    <div className="container mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/streams')}
        className="flex items-center space-x-2 text-blue-500 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>Back to streams</span>
      </button>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="aspect-video">
            <HLSPlayer
              src={streamUrl}
              onError={handlePlayerError}
              onReady={handlePlayerReady}
              className="w-full h-full"
            />
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stream.title}
                </h1>
                {stream.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {stream.description}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                  stream.status === 'LIVE' ? 'bg-red-500' :
                  stream.status === 'OFFLINE' ? 'bg-gray-500' : 'bg-yellow-500'
                }`}>
                  {stream.status}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <div className="flex">
                  <div className="text-red-400">⚠️</div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      Playback Error
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Resolution</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {stream.resolution}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Bitrate</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {stream.bitrate} kbps
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Viewers</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {stream.viewersCount.toLocaleString()}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="text-gray-500 dark:text-gray-400 mb-1">Started</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(stream.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                Stream URL
              </h3>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                  {streamUrl}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}