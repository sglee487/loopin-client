import type { Meta } from '@storybook/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import PlaylistsContainer from './PlaylistsContainer.tsx';
import {configureStore, createSlice} from "@reduxjs/toolkit";
import { Playlist } from "../../domain/entities/Playlist.ts";

const meta = {
    component: PlaylistsContainer,
    decorators: [
        (Story) => (
            <div style={{ padding: '2rem' }}>
                <Story/>
            </div>
        ),
    ],
    tags: ['autodocs']
} satisfies Meta<typeof PlaylistsContainer>;

export default meta;

export interface PlaylistsState {
    playlists: Playlist[];
    loading: boolean;
    error: string | null;
}

export interface PlaylistsRootState {
    playlists: PlaylistsState;
}

const initialState: PlaylistsState = {
    playlists: [
        {
            "playlistId": "PLx8rAXc66SGIqrxzBZ9yaGx2sGbby51dM",
            "channelId": "UCYzIlosTCqwoRUzNgV21o_Q",
            "title": "빙고 댄스_와이제이 패밀리(와이제이 패밀리(YJ Family) CD2",
            "description": "https://music.bugs.co.kr/album/8009100?wl_ref=list_tr_11_myalbum",
            "thumbnail": "https://i.ytimg.com/vi/_xnBucjnPuQ/sddefault.jpg",
            "channelTitle": "이상건",
            "localized": {
                "title": "빙고 댄스_와이제이 패밀리(와이제이 패밀리(YJ Family) CD2",
                "description": "https://music.bugs.co.kr/album/8009100?wl_ref=list_tr_11_myalbum"
            },
            "contentDetails": {
                "itemCount": 16
            },
            "items": undefined,
            "publishedAt": new Date("2022-05-31T17:22:37.377Z"),
            "updatedAt": new Date("2025-01-01T06:30:48.085655800Z"),
            "platformType": "YOUTUBE"
        },
        {
            "playlistId": "PLx8rAXc66SGIrgUK8kv8GiAFfIhg8jEZq",
            "channelId": "UCYzIlosTCqwoRUzNgV21o_Q",
            "title": "song",
            "description": "",
            "thumbnail": "https://i.ytimg.com/vi/x2XX3cNW4K0/maxresdefault.jpg",
            "channelTitle": "이상건",
            "localized": {
                "title": "song",
                "description": ""
            },
            "contentDetails": {
                "itemCount": 17
            },
            "items": undefined,
            "publishedAt": new Date("2016-06-18T08:57:04.242Z"),
            "updatedAt": new Date("2025-01-01T06:30:48.085655800Z"),
            "platformType": "YOUTUBE"
        }
    ],
    loading: false,
    error: null,
};

interface MockStoreProps {
    initialState: PlaylistsState;
    children: React.ReactNode;
}

const MockStore: React.FC<MockStoreProps> = ({ initialState, children }) => (
    <Provider
        store={configureStore({
            reducer: {
                playlists: createSlice({
                    name: 'playlists',
                    initialState,
                    reducers: {
                        // updateTaskState: (state, action) => {
                        //   const { id, newTaskState } = action.payload;
                        //   const task = state.tasks.findIndex((task) => task.id === id);
                        //   if (task >= 0) {
                        //     state.tasks[task].state = newTaskState;
                        //   }
                        // },
                    },
                }).reducer,
            },
        })}
    >
        <BrowserRouter>
            {children}
        </BrowserRouter>
    </Provider>
);

export const Default = {
    decorators: [
        (Story) => <MockStore initialState={initialState}><Story/></MockStore>,
    ],
} satisfies Meta<typeof PlaylistsContainer>;

export const Loading = {
    decorators: [
        (Story) => <MockStore initialState={{
            ...initialState,
            loading: true,
        }}><Story/></MockStore>
    ]
} satisfies Meta<typeof PlaylistsContainer>;

export const Empty = {
    decorators: [
        (Story) => <MockStore initialState={{
            ...initialState,
            playlists: [],
        }}><Story/></MockStore>
    ]
} satisfies Meta<typeof PlaylistsContainer>;

export const Error = {
    decorators: [
        (Story) => <MockStore initialState={{
            ...initialState,
            error: "something went wrong",
        }}><Story/></MockStore>
    ]
} satisfies Meta<typeof PlaylistsContainer>;