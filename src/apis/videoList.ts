import axios from "axios";
import {
  CurrentPlay,
  CurrentPlays,
  PlayListItem,
  PlayListQueue,
} from "../types/PlayLists";

export interface PlayListData {
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

export interface PlayListQueuesResponseData {
  playListId: string;
  prev: PlayListItem[];
  next: PlayListItem[];
}

export async function loadPlayList(
  playListId: string,
  refresh: boolean = false
): Promise<PlayListData> {
  return axios
    .get<PlayListData>(
      `http://localhost:8080/api/v1/list/listitems?playlistId=${playListId}`
    )
    .then((response) => response.data);
}

export async function loadUserCurrentPlays(
  token: string
): Promise<CurrentPlays> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user_plays/current-plays`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.request<CurrentPlays>(config).then((response) => response.data);
}

export async function loadUserPlayListQueues(
  token: string,
  playListId: string
): Promise<PlayListQueuesResponseData> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user_plays/playlist-queues/${playListId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  return axios
    .request<PlayListQueuesResponseData>(config)
    .then((response) => response.data);
}

export async function uploadUserPlayListQueue(
  token: string,
  playListId: string,
  playListQueue: PlayListQueue,
  currentPlay: CurrentPlay
) {
  const data = {
    playListId,
    playListQueues: playListQueue,
    currentPlays: currentPlay,
  };

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user_plays`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios.request(config);
}
