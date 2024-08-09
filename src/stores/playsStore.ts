import { defineStore } from "pinia";
import { ref, inject } from "vue";
import { PlayLists, CurrentPlays, PlayListItem } from "../types";

import Keycloak from "keycloak-js";

import axios from "axios";
export const usePlaysStore = defineStore(
  "plays",
  () => {
    const keycloak = inject("$keycloak") as Keycloak;
    const serviceURL = inject("$serviceURL") as string;

    // State
    const playLists = ref<PlayLists>({});
    const currentPlays = ref<CurrentPlays>({});

    // Actions
    async function uploadUserPlays(playListId: string) {
      if (
        !keycloak.authenticated ||
        keycloak.token === undefined ||
        keycloak.token === null
      ) {
        console.log("token is null");
        return;
      }

      const data = {
        playListId: playListId,
        playListQueues: playLists.value[playListId],
        currentPlays: currentPlays.value[playListId],
      };

      console.log(serviceURL);

      const config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${serviceURL}/api/v1/user_plays`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
        data: data,
      };

      try {
        const response = await axios.request(config);
        console.log(JSON.stringify(response.data));
      } catch (error) {
        console.log(error);
      }
    }

    async function downloadUserCurrentPlays() {
      if (
        !keycloak.authenticated ||
        keycloak.token === undefined ||
        keycloak.token === null
      ) {
        console.log("token is null");
        return;
      }

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${serviceURL}/api/v1/user_plays/current-plays`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
      };

      try {
        const response = await axios.request(config);

        // Convert response.data object to CurrentPlays
        for (const key in response.data) {
          currentPlays.value[key] = {
            startSeconds: response.data[key].startSeconds,
            playListId: response.data[key].playListId,
            channelId: response.data[key].channelId,
            title: response.data[key].title,
            description: response.data[key].description,
            thumbnail: response.data[key].thumbnail,
            channelTitle: response.data[key].channelTitle,
            localized: {
              title: response.data[key].localized.title,
              description: response.data[key].localized.description,
            },
            contentDetails: {
              itemCount: response.data[key].contentDetails.itemCount,
            },
            item: response.data[key].item,
            publishedAt: response.data[key].publishedAt,
            updatedAt: response.data[key].updatedAt,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }

    async function downloadUserPlayListQueues(playListId: string) {
      if (
        !keycloak.authenticated ||
        keycloak.token === undefined ||
        keycloak.token === null
      ) {
        console.log("token is null");
        return;
      }

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${serviceURL}/api/v1/user_plays/playlist-queues/${playListId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${keycloak.token}`,
        },
      };

      try {
        const response = await axios.request(config);
        const prevData: PlayListItem[] = (response.data.prev as any[]).map(
          (item) => convertResponseDataToPlayListItem(item),
        );

        const nextData: PlayListItem[] = (response.data.next as any[]).map(
          (item) => convertResponseDataToPlayListItem(item),
        );

        playLists.value[playListId] = {
          prev: prevData,
          next: nextData,
        };
      } catch (error) {
        console.log(error);
      }
    }

    function convertResponseDataToPlayListItem(data: any): PlayListItem {
      return {
        channelId: data.channelId,
        channelTitle: data.channelTitle,
        description: data.description,
        playListId: data.playListId,
        position: data.position,
        publishedAt: data.publishedAt,
        resource: {
          kind: data.resource.kind,
          videoId: data.resource.videoId,
        },
        thumbnail: data.thumbnail,
        title: data.title,
        videoOwnerChannelId: data.videoOwnerChannelId,
        videoOwnerChannelTitle: data.videoOwnerChannelTitle,
      };
    }

    // Return the state and actions
    return {
      playLists,
      currentPlays,
      uploadUserPlays,
      downloadUserCurrentPlays,
      downloadUserPlayListQueues,
      convertResponseDataToPlayListItem,
    };
  },
  {
    persist: true,
  },
);
