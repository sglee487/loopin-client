import { PlayItem } from "./PlayItem";
import { Playlist } from "./Playlist";

export interface CurrentPlayMap {
    [key: string]: CurrentPlay;
}

export interface CurrentPlay {
    nowPlayingItem?: PlayItem;
    playlist: Playlist;

    startSeconds: number;

    prev: PlayItem[];
    next: PlayItem[];
    prevItemCount: number;
    nextItemCount: number;
}
