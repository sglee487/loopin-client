import { defineStore } from "pinia";
import { ref } from "vue";
import { PlayLists, CurrentPlays } from "../types";

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
        url: "http://localhost:8080/api/v1/user_plays",
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
  },
  persist: true,
});
