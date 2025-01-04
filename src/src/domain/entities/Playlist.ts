import { PlayItem } from "./PlayItem";

export interface Playlist {
    playlistId: string;
    channelId: string;
    title: string;

    description?: string;
    thumbnail?: string;
    channelTitle: string;

    localized: Localized;
    contentDetails: contentDetails;

    publishedAt: Date;
    items?: PlayItem[]

    updatedAt: Date;

    platformType: string;
}

export interface Localized {
    title: string;
    description: string;
}

export interface contentDetails {
    itemCount: number;
}