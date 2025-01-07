import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CurrentPlay, CurrentPlayMap } from '../../domain/entities/CurrentPlay';
import { loadPlaylistById } from '../actions/playItemActions';
import { PlayItem } from "../../domain/entities/PlayItem.ts";

export interface CurrentPlayMapState {
    currentPlayMap: CurrentPlayMap;
    loading: boolean;
    error: string | null;
}

export interface CurrentPlayMapRootState {
    currentPlayMap: CurrentPlayMapState;
}

const initialState: CurrentPlayMapState = {
    currentPlayMap: new Map<string, CurrentPlay>(),
    loading: false,
    error: null,
}

const currentPlayMapSlice = createSlice({
    name: 'currentPlayMap',
    initialState,
    reducers: {
        playSelectedPlayItem: (
            state,
            action: PayloadAction<{
                playlistId: string;
                selectedPlayItem: PlayItem;
            }>
        ) => {
            const { playlistId, selectedPlayItem } = action.payload;
            const currentPlay = state.currentPlayMap.get(playlistId);

            if (!currentPlay) {
                console.error(`Playlist with ID ${playlistId} not found.`);
                return;
            }

            if (currentPlay.nowPlayingItem) {
                currentPlay.prev.push(currentPlay.nowPlayingItem);
            }

            currentPlay.prev = currentPlay.prev.filter(
                (item) => item.resource.videoId !== selectedPlayItem.resource.videoId
            );

            currentPlay.next = currentPlay.next.filter(
                (item) => item.resource.videoId !== selectedPlayItem.resource.videoId
            );

            currentPlay.nowPlayingItem = {
                ...selectedPlayItem,
                startSeconds: 0, // startSeconds 값을 0으로 설정
            };

            state.currentPlayMap.set(playlistId, currentPlay)
        },
        backToPrev: (state, action: PayloadAction<{
            playlistId: string;
            prevPlayItem: PlayItem;
        }>) => {
            const { playlistId, prevPlayItem } = action.payload;

            const currentPlay = state.currentPlayMap.get(playlistId);

            if (!currentPlay) {
                console.error(`Playlist with ID ${playlistId} not found.`);
                return;
            }

            if (currentPlay.nowPlayingItem) {
                currentPlay.next.unshift(currentPlay.nowPlayingItem);
            }

            currentPlay.prev = currentPlay.prev.filter(
                (item) => item.resource.videoId !== prevPlayItem.resource.videoId
            );

            currentPlay.next = currentPlay.next.filter(
                (item) => item.resource.videoId !== prevPlayItem.resource.videoId
            );

            currentPlay.nowPlayingItem = {
                ...prevPlayItem,
                startSeconds: 0, // startSeconds 값을 0으로 설정
            };

            state.currentPlayMap.set(playlistId, currentPlay)

        },
        setStartSeconds: (
            state,
            action: PayloadAction<{
                playlistId: string;
                startSeconds: number;
            }>
        ) => {
            const { playlistId, startSeconds } = action.payload;

            const currentPlay = state.currentPlayMap.get(playlistId);
            if (!currentPlay) {
                console.error(`Playlist with ID ${playlistId} not found.`);
                return;
            }

            if (currentPlay.nowPlayingItem === undefined) {
                console.error(`Playlist with ID ${playlistId} not found.`);
                return;
            }

            currentPlay.nowPlayingItem.startSeconds = startSeconds;

        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPlaylistById.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadPlaylistById.fulfilled, (state, action) => {
                state.loading = false;

                const playlist = action.payload;

                // TODO: if add new list, add in next queue

                if (state.currentPlayMap.get(playlist.playlistId) !== undefined) {
                    return
                }

                const currentPlay: CurrentPlay = {
                    nowPlayingItem: undefined,
                    playlist: playlist,
                    prev: [],
                    next: playlist.items ?? [],
                };

                state.currentPlayMap.set(playlist.playlistId, currentPlay);
            })
            .addCase(loadPlaylistById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Error fetching playlist by id'
            })
    }
})


export const { playSelectedPlayItem, backToPrev, setStartSeconds } = currentPlayMapSlice.actions;

export default currentPlayMapSlice.reducer;