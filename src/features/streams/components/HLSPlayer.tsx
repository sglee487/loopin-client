import { useRef, useEffect, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { HLSQuality } from '../types';

interface HLSPlayerProps {
  src: string;
  onError?: (error: string) => void;
  onReady?: () => void;
  className?: string;
}

export default function HLSPlayer({ src, onError, onReady, className = '' }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstance = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableQualities, setAvailableQualities] = useState<HLSQuality[]>([]);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');

  const qualityOptions: HLSQuality[] = [
    { value: 'auto', label: 'Auto', description: 'Automatic quality selection' },
    { value: '720p', label: '720p', description: '1280x720, High quality' },
    { value: '360p', label: '360p', description: '640x360, Low quality' },
  ];

  const loadHLS = useCallback(() => {
    if (!videoRef.current || !src) return;

    if (hlsInstance.current) {
      hlsInstance.current.destroy();
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: false,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        maxBufferSize: 60 * 1000 * 1000,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        liveDurationInfinity: true,
        progressive: false,
        startLevel: -1,
        capLevelToPlayerSize: true,
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(src);
      });

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        onReady?.();
        setAvailableQualities(
          data.levels.map((level, index) => ({
            value: index.toString(),
            label: `${level.height}p`,
            description: `${level.width}x${level.height}, ${Math.round(level.bitrate / 1000)}kbps`,
            bandwidth: level.bitrate,
            resolution: `${level.width}x${level.height}`,
          }))
        );

        const playPromise = videoRef.current?.play();
        if (playPromise) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log('Auto-play failed:', error);
              onError?.('Auto-play was blocked. Click to play manually.');
            });
        }
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error('HLS Error:', data);
        if (data.fatal) {
          let errorMessage = 'A streaming error occurred';
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              errorMessage = 'Network error occurred. Please check your connection.';
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              errorMessage = 'Media error occurred. Please try refreshing.';
              break;
            default:
              errorMessage = 'Fatal streaming error occurred.';
              break;
          }
          onError?.(errorMessage);
        }
      });

      hls.attachMedia(videoRef.current);
      hlsInstance.current = hls;
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = src;
      videoRef.current.addEventListener('loadedmetadata', () => {
        onReady?.();
        const playPromise = videoRef.current?.play();
        if (playPromise) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log('Native HLS auto-play failed:', error);
              onError?.('Auto-play was blocked. Click to play manually.');
            });
        }
      });
    } else {
      onError?.('HLS is not supported in this browser.');
    }
  }, [src, onError, onReady]);

  const handleQualityChange = (qualityValue: string) => {
    setSelectedQuality(qualityValue);

    if (!hlsInstance.current) return;

    if (qualityValue === 'auto') {
      hlsInstance.current.currentLevel = -1;
    } else {
      const levelIndex = availableQualities.findIndex(q =>
        q.label.includes(qualityValue.replace('p', ''))
      );
      if (levelIndex !== -1) {
        hlsInstance.current.currentLevel = parseInt(availableQualities[levelIndex].value);
      }
    }
  };

  const handleVideoClick = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      const playPromise = videoRef.current.play();
      if (playPromise) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log('Manual play failed:', error);
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    loadHLS();

    return () => {
      if (hlsInstance.current) {
        hlsInstance.current.destroy();
      }
    };
  }, [loadHLS]);

  return (
    <div className={`relative ${className}`}>
      {/* Quality selector */}
      <div className="absolute top-4 right-4 z-10">
        <select
          value={selectedQuality}
          onChange={(e) => handleQualityChange(e.target.value)}
          className="bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded border-none outline-none"
        >
          {qualityOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <video
        ref={videoRef}
        controls
        muted
        playsInline
        onClick={handleVideoClick}
        className="w-full h-auto rounded-lg bg-black"
      />

      {!isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer rounded-lg"
          onClick={handleVideoClick}
        >
          <div className="text-center text-white">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Click to play</p>
          </div>
        </div>
      )}
    </div>
  );
}