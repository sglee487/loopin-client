import axios from 'axios';
import { Playlist } from '@domain/entities/Playlist';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

/**
 * Fetches a list of playlists from the server.
 * This function retrieves up to 50 playlists and converts date strings to Date objects.
 * 
 * @returns {Promise<Playlist[]>} A promise that resolves to an array of playlists
 */
export const fetchPlaylists = async (): Promise<Playlist[]> => {
  const response = await axios.get(`${API_BASE_URL}/playlists?size=50`);
  return response.data.data.content.map((item: any) => ({
    ...item,
    playListId: item.playlistId,
    publishedAt: new Date(item.publishedAt),
    updatedAt: new Date(item.publishedAt),
  }));
};

/**
 * Fetches a specific playlist by its ID from the server.
 * This function retrieves the playlist details and converts date strings to Date objects.
 * 
 * @param {string} id - The ID of the playlist to fetch
 * @returns {Promise<Playlist>} A promise that resolves to the requested playlist
 */
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