import { PlayItem } from "@domain/entities/PlayItem";

/**
 * Represents a playlist entity in the application.
 * This interface defines the structure of a playlist, including its metadata and content details.
 */
export interface Playlist {
    /** Unique identifier for the playlist */
    playlistId: string;
    /** ID of the channel that owns the playlist */
    channelId: string;
    /** Title of the playlist */
    title: string;

    /** Optional description of the playlist */
    description?: string;
    /** Optional URL to the playlist's thumbnail image */
    thumbnail?: string;
    /** Title of the channel that owns the playlist */
    channelTitle: string;

    /** Localized information for the playlist */
    localized: Localized;
    /** Details about the playlist's content */
    contentDetails: contentDetails;

    /** Date when the playlist was published */
    publishedAt: Date;
    /** Optional array of items in the playlist */
    items?: PlayItem[]

    /** Date when the playlist was last updated */
    updatedAt: Date;

    /** Type of platform the playlist is from (e.g., 'youtube', 'vimeo') */
    platformType: string;
}

/**
 * Contains localized information for a playlist.
 * This interface is used to store title and description in different languages.
 */
export interface Localized {
    /** Localized title of the playlist */
    title: string;
    /** Localized description of the playlist */
    description: string;
}

/**
 * Contains details about the playlist's content.
 * This interface provides information about the number of items in the playlist.
 */
export interface contentDetails {
    /** Total number of items in the playlist */
    itemCount: number;
}