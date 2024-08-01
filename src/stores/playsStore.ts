import { defineStore } from "pinia";
import { ref } from "vue";
import { PlayLists, CurrentPlays, PlayListItem } from "../types";

import axios from "axios";

export const usePlaysStore = defineStore("plays", {
  state: () => ({
    playLists: ref<PlayLists>({}),
    currentPlays: ref<CurrentPlays>({}),
  }),
  actions: {
    async uploadUserPlays(
      playListId: string,
      token: string | null | undefined,
    ) {
      if (token === undefined || token === null) {
        console.log("token is null");
      }

      let data = {
        playListId: playListId,
        playListQueues: this.playLists[playListId],
        currentPlays: this.currentPlays[playListId],
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_SERVICE_URL}/api/v1/user_plays`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async downloadUserCurrentPlays(token: string | null | undefined) {
      if (token === undefined || token === null) {
        console.log("token is null");
      }

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_SERVICE_URL}/api/v1/user_plays/current-plays`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(config);
      // convert response.data object to CurrentPlays
      for (const key in response.data) {
        this.currentPlays[key] = {
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
    },
    async downloadUserPlayListQueues(
      playListId: string,
      token: string | null | undefined,
    ) {
      if (token === undefined || token === null) {
        console.log("token is null");
      }

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${import.meta.env.VITE_SERVICE_URL}/api/v1/user_plays/playlist-queues/${playListId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.request(config);
      const prevData: PlayListItem[] = (response.data.prev as any[]).map(
        (item) => this.convertResponseDataToPlayListItem(item),
      );

      const nextData: PlayListItem[] = (response.data.next as any[]).map(
        (item) => this.convertResponseDataToPlayListItem(item),
      );
      this.playLists[playListId] = {
        prev: prevData,
        next: nextData,
      };
    },

    convertResponseDataToPlayListItem(data: any): PlayListItem {
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
    },
  },
  persist: true,
});
