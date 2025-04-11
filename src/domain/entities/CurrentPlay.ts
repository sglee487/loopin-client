import { PlayItem } from "@domain/entities/PlayItem";
import { Playlist } from "@domain/entities/Playlist";

/**
 * Maps playlist IDs to their current play state.
 * This interface is used to track the current play state of multiple playlists.
 */
export interface CurrentPlayMap {
    [key: string]: CurrentPlay;
}

/**
 * Represents the current play state of a playlist.
 * This interface tracks the currently playing item, playlist information,
 * and navigation history within the playlist.
 */
export interface CurrentPlay {
    /** The item currently being played */
    nowPlayingItem?: PlayItem;
    /** The playlist containing the current item */
    playlist: Playlist;

    /** The number of seconds into the current item */
    startSeconds: number;

    /** Array of previously played items */
    prev: PlayItem[];
    /** Array of upcoming items */
    next: PlayItem[];
    /** Number of items in the previous items array */
    prevItemCount: number;
    /** Number of items in the next items array */
    nextItemCount: number;
}
