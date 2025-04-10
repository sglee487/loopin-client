import axios from 'axios';
import { Playlist } from '../../../domain/entities/Playlist';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  const response = await axios.get(`${API_BASE_URL}/playlists?size=50`);
  return response.data.data.content.map((item: any) => ({
    ...item,
    playListId: item.playlistId,
    publishedAt: new Date(item.publishedAt),
    updatedAt: new Date(item.publishedAt),
  }));
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
  const response = await axios.get(`${API_BASE_URL}/playlists/${id}`);
  const item = response.data.data;
  return {
    ...item,
    playListId: item.playlistId,
    publishedAt: new Date(item.publishedAt),
    updatedAt: new Date(item.updatedAt),
  };
};