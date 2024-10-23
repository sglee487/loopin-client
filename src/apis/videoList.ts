import axios from "axios";
import { PlayListItem } from "../types/PlayLists";

export async function loadPlayList(
  playListId: string,
  refresh: boolean = false
): Promise<ResponseData> {
  return axios
    .get<ResponseData>(
      `http://localhost:8080/api/v1/list/listitems?playlistId=${playListId}`
    )
    .then((response) => response.data);
}

export interface ResponseData {
  playListId: string;
  channelId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  localized: {
    title: string;
    description: string;
  };
  contentDetails: {
    itemCount: number;
  };
  items: PlayListItem[];
  publishedAt: string;
  updatedAt: string;
}
