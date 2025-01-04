import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlaylists, fetchPlaylistById } from '../../infrastructure/api/services/playItemService';

export const loadPlaylists = createAsyncThunk('playlists/load', async () => {
  return await fetchPlaylists();
});

export const loadPlaylistById = createAsyncThunk('playlist/load', async (id: string) => {
  return await fetchPlaylistById(id);
})