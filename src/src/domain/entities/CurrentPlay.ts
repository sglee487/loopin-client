import { PlayItem } from "./PlayItem";
import { Playlist } from "./Playlist";

export interface CurrentPlayMap extends Map<string, CurrentPlay> {}

export interface CurrentPlay {
    nowPlayingItem?: PlayItem;
    playlist: Playlist;

    prev: PlayItem[];
    next: PlayItem[];
}
