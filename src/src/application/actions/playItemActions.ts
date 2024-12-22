import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPlayItems } from '../../infrastructure/api/services/playItemService';

export const loadPlayItems = createAsyncThunk('playItems/load', async () => {
  return await fetchPlayItems();
});