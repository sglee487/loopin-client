// import axios from 'axios';
import { CurrentPlay, CurrentPlayMap } from '@domain/entities/CurrentPlay';
import { PlayItem } from '@domain/entities/PlayItem';
import axiosInstance from '@infrastructure/api/axiosInstance';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Uploads the current play state for a specific playlist to the server.
 * This includes the currently playing item, previous and next items, and start time.
 * 
 * @param {string} playlistId - The ID of the playlist to update
 * @param {CurrentPlay} currentPlay - The current play state to upload
 * @returns {Promise<undefined>} A promise that resolves when the upload is complete
 */
export const uploadCurrentPlay = async (playlistId: string, currentPlay: CurrentPlay): Promise<undefined> => {
  const data = {
    nowPlayingItem: currentPlay.nowPlayingItem,
    prevItemIdList: currentPlay.prev.map((item) => item.resource.videoId),
    nextItemIdList: currentPlay.next.map((item) => item.resource.videoId),
    startSeconds: currentPlay.startSeconds,
  }
  await axiosInstance.post(`${API_BASE_URL}/current-plays/${playlistId}`, data);
};

/**
 * Updates only the start seconds (current position) for a specific playlist.
 * This is used when the user seeks to a different position in the video.
 * 
 * @param {string} playlistId - The ID of the playlist to update
 * @param {number} startSeconds - The new start position in seconds
 * @returns {Promise<undefined>} A promise that resolves when the update is complete
 */
export const uploadCurrentPlayStartSeconds = async (playlistId: string, startSeconds: number): Promise<undefined> => {
  await axiosInstance.patch(`${API_BASE_URL}/current-plays/${playlistId}/start-seconds`, {
    startSeconds: startSeconds,
  });
}

/**
 * Fetches the current play state for all playlists from the server.
 * This includes converting date strings to Date objects for all relevant fields.
 * 
 * @returns {Promise<CurrentPlayMap>} A promise that resolves to a map of playlist IDs to their current play states
 */
export const fetchCurrentPlayMap = async (): Promise<CurrentPlayMap> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/current-plays`);
  const item = response.data.data;

  const currentPlayMap: CurrentPlayMap = Object.entries(item.currentPlayMap).reduce(
    (acc, [key, value]) => {
      const currentPlay = value as CurrentPlay; // 타입 강제 지정
      acc[key] = {
        ...currentPlay, // 여기서 에러가 해결됨
        prev: currentPlay.prev.map((item) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        })),
        next: currentPlay.next.map((item) => ({
          ...item,
          publishedAt: new Date(item.publishedAt),
        })),
        nowPlayingItem: currentPlay.nowPlayingItem
          ? {
            ...currentPlay.nowPlayingItem,
            publishedAt: new Date(currentPlay.nowPlayingItem.publishedAt),
          }
          : undefined,
        playlist: {
          ...currentPlay.playlist,
          publishedAt: new Date(currentPlay.playlist.publishedAt),
          updatedAt: new Date(currentPlay.playlist.updatedAt),
        },
      };
      return acc;
    },
    {} as CurrentPlayMap
  );
  return currentPlayMap;
};

/**
 * Fetches the current play state for a specific playlist from the server.
 * This includes converting date strings to Date objects for all relevant fields.
 * 
 * @param {string} playlistId - The ID of the playlist to fetch
 * @returns {Promise<CurrentPlay>} A promise that resolves to the current play state for the specified playlist
 */
export const fetchCurrentPlay = async (playlistId: string): Promise<CurrentPlay> => {
  const response = await axiosInstance.get(`${API_BASE_URL}/current-plays/${playlistId}`);
  const item = response.data.data;

  const currentPlay: CurrentPlay = {
    ...item,
    nowPlayingItem: item.nowPlayingItem
      ? {
        ...item.nowPlayingItem,
        publishedAt: new Date(item.nowPlayingItem.publishedAt),
      }
      : undefined,
    playlist: {
      ...item.playlist,
      publishedAt: new Date(item.playlist.publishedAt),
      updatedAt: new Date(item.playlist.updatedAt),
      items: item.playlist.items?.map((playItem: PlayItem) => ({
        ...playItem,
        publishedAt: new Date(playItem.publishedAt),
      })),
    },
    prev: item.prev.map((playItem: PlayItem) => ({
      ...playItem,
      publishedAt: new Date(playItem.publishedAt),
    })),
    next: item.next.map((playItem: PlayItem) => ({
      ...playItem,
      publishedAt: new Date(playItem.publishedAt),
    })),
  };

  return currentPlay;
};