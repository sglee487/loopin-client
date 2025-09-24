import { useNavigate } from 'react-router-dom';
import { useGetStreamsQuery } from '../api/streamsApi';
import StreamCard from '../components/StreamCard';
import { Stream } from '../types';

export default function StreamsListPage() {
  const navigate = useNavigate();
  const { data: streams = [], isLoading, error } = useGetStreamsQuery();

  const handleStreamClick = (stream: Stream) => {
    navigate(`/streams/${stream.publicId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading streams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Failed to load streams
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please check if the streaming server is running
          </p>
        </div>
      </div>
    );
  }

  if (!streams.length) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No streams available
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No live streams are currently broadcasting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Live Streams
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {streams.length} stream{streams.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {streams.map((stream) => (
          <StreamCard
            key={stream.id}
            stream={stream}
            onClick={handleStreamClick}
          />
        ))}
      </div>
    </div>
  );
}