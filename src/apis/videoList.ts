import axios from "axios";
import { CurrentPlays, PlayListItem } from "../types/PlayLists";
import { useKeycloak } from "@react-keycloak/web";

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

export interface PlayListQueuesResponseData {
  playListId: string;
  prev: PlayListItem[];
  next: PlayListItem[];
}

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

export async function loadUserCurrentPlays(): Promise<CurrentPlays> {
  const { keycloak, initialized } = useKeycloak();
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user_plays/current-plays`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keycloak.token}`,
    },
  };
  return axios.request<CurrentPlays>(config).then((response) => response.data);
}

export async function loadUserPlayListQueues(
  playListId: string
): Promise<PlayListQueuesResponseData> {
  const { keycloak, initialized } = useKeycloak();
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `http://localhost:8080/api/v1/user_plays/playlist-queues/${playListId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${keycloak.token}`,
    },
  };
  return axios
    .request<PlayListQueuesResponseData>(config)
    .then((response) => response.data);
}
