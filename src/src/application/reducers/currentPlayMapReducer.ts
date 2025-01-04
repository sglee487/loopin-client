import { createSlice } from '@reduxjs/toolkit';
import { CurrentPlay, CurrentPlayMap } from '../../domain/entities/CurrentPlay';
import { loadPlaylistById } from '../actions/playItemActions';

export interface CurrentPlayMapState {
    CurrentPlayMap: CurrentPlayMap;
    loading: boolean;
    error: string | null;
}

export interface CurrentPlayMapRootState {
    currentPlayMap: CurrentPlayMapState;
}

const initialState: CurrentPlayMapState = {
    CurrentPlayMap: new Map<string, CurrentPlay>(),
    loading: false,
    error: null,
}

const currentPlayMapSlice = createSlice({
    name: 'currentPlayMap',
    initialState,
    reducers: {
        // initCurrentPlay: (
        //     state,
        //     action: PayloadAction<{
        //         playlistId: string;
        //         playlist: Playlist;
        //     }>
        // ) => {
        //     const playlistId = action.payload.playlistId;
        //     const playlist = action.payload.playlist;

        //     state.item[playlistId] = {
        //         nowPlayingItem: playlist.,
        //         plr
        //     }
        // }
    },
    extraReducers: (builder) => {
        builder
        .addCase(loadPlaylistById.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadPlaylistById.fulfilled, (state, action) => {
            state.loading = false;
            const playlist = action.payload;

            const currentPlay: CurrentPlay = {
                nowPlayingItem: undefined,
                playlist: playlist,
                prev: [],
                next: playlist.items ?? []
            };

            state.CurrentPlayMap.set(playlist.playlistId, currentPlay);
        })
        .addCase(loadPlaylistById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || 'Error fetching playlist by id'
        })
    }
})

export default currentPlayMapSlice.reducer;