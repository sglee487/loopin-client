import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchCurrentPlay, fetchCurrentPlayMap } from '../../infrastructure/api/services/currentPlayService';


export const pullCurrentPlayMap = createAsyncThunk('currentPlayMap/pull', async () => {
    return await fetchCurrentPlayMap();
});

export const pullCurrentPlay = createAsyncThunk('currentPlay/pull', async (playlistId: string) => {
    return await fetchCurrentPlay(playlistId);
});

export const shuffleNextQueue = createAction('currentPlay/shuffleNextQueue', (playlistId: string) => {
    return {
        payload: {
            playlistId,
        },
    };
});