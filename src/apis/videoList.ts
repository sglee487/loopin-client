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


const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

export async function loadPlayList(
  playListId: string,
  refresh: boolean = false
): Promise<PlayListData> {
  return axios
    .get<PlayListData>(
      `${API_BASE_URL}/lists/item?playlistId=${playListId}`
    )
    .then((response) => response.data);
}

export async function loadUserCurrentPlays(
  token: string
): Promise<CurrentPlays> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/user_plays/current-plays`,
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
    url: `${API_BASE_URL}/user_plays/playlist-queues/${playListId}`,
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
    url: `${API_BASE_URL}/user_plays`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };

  axios.request(config);
}

export async function deleteUserPlayListQueue(
  token: string,
  playListId: string
) {
  const data = {
    playListId: playListId,
  };

  const config = {
    method: "delete",
    maxBodyLength: Infinity,
    url: `${API_BASE_URL}/user_plays`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: data,
  };
  axios.request(config);
}
