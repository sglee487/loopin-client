// import axios from 'axios';
import { CurrentPlay, CurrentPlayMap } from '../../../domain/entities/CurrentPlay';
import { PlayItem } from '../../../domain/entities/PlayItem';
import axiosInstance from '../axiosInstance';

export const uploadCurrentPlay = async (playlistId: string, currentPlay: CurrentPlay): Promise<undefined> => {
  const data = {
    nowPlayingItem: currentPlay.nowPlayingItem,
    prevItemIdList: currentPlay.prev.map((item) => item.resource.videoId),
    nextItemIdList: currentPlay.next.map((item) => item.resource.videoId),
    startSeconds: currentPlay.startSeconds,
  }
  await axiosInstance.post(`http://localhost:8080/api/v1/current-plays/${playlistId}`, data);
};

export const uploadCurrentPlayStartSeconds = async (playlistId: string, startSeconds: number): Promise<undefined> => {
  await axiosInstance.patch(`http://localhost:8080/api/v1/current-plays/${playlistId}/start-seconds`, {
    startSeconds: startSeconds,
  });
}

export const fetchCurrentPlayMap = async (): Promise<CurrentPlayMap> => {
  const response = await axiosInstance.get(`http://localhost:8080/api/v1/current-plays`);
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

export const fetchCurrentPlay = async (playlistId: string): Promise<CurrentPlay> => {
  const response = await axiosInstance.get(`http://localhost:8080/api/v1/current-plays/${playlistId}`);
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