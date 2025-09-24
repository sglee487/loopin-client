import { Stream } from '../types';

interface StreamCardProps {
  stream: Stream;
  onClick: (stream: Stream) => void;
}

export default function StreamCard({ stream, onClick }: StreamCardProps) {
  const formatViewersCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'bg-red-500';
      case 'OFFLINE':
        return 'bg-gray-500';
      case 'SCHEDULED':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
      onClick={() => onClick(stream)}
    >
      <div className="relative">
        <div className="w-full h-48 bg-gray-900 rounded-t-lg flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-4xl mb-2">📺</div>
            <div className="text-sm opacity-75">Live Stream</div>
          </div>
        </div>

        <div className="absolute top-2 left-2 flex items-center space-x-2">
          <span className={`px-2 py-1 rounded text-white text-xs font-semibold ${getStatusColor(stream.status)}`}>
            {stream.status}
          </span>
          {stream.status === 'LIVE' && (
            <span className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              {formatViewersCount(stream.viewersCount)} viewers
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
          {stream.resolution}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg mb-2 line-clamp-2">
          {stream.title}
        </h3>

        {stream.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {stream.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-3">
            <span>{stream.bitrate} kbps</span>
            <span>•</span>
            <span>{new Date(stream.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}