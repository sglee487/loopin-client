import axios from 'axios';
import { Playlist } from '../../../domain/entities/Playlist';

export const fetchPlaylists = async (): Promise<Playlist[]> => {
  const response = await axios.get('http://localhost:8080/api/v1/playlists?size=50');
  return response.data.data.content.map((item: any) => ({
    ...item,
    playListId: item.playlistId,
    publishedAt: new Date(item.publishedAt),
    updatedAt: new Date(item.publishedAt),
  }));
};

export const fetchPlaylistById = async (id: string): Promise<Playlist> => {
  const response = await axios.get(`http://localhost:8080/api/v1/playlists/${id}`);
  const item = response.data.data;
  return {
    ...item,
    playListId: item.playlistId,
    publishedAt: new Date(item.publishedAt),
    updatedAt: new Date(item.updatedAt),
  };
};