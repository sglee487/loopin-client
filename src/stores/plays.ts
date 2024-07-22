import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PlayLists, CurrentPlays } from '../types'

import { useKeycloak } from "@josempgon/vue-keycloak";
import axios from 'axios'

const { token } = useKeycloak();

export const usePlaysStore = defineStore('plays', {
  state: () => ({
    playLists: ref<PlayLists>({}),
    currentPlays: ref<CurrentPlays>({})
  }),
  actions: {
    async uploadUserPlays(playListId: string) {
      
      if (token.value === undefined || token.value === null) {
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
          Authorization: `Bearer ${token.value}`,
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
    }
  },
  persist: true
})


// export const usePlaysStore = defineStore('plays', () => {

//   state: () => ({
//     playLists: ref<PlayLists>({}),
//     currentPlays: ref<CurrentPlays>({})
//   })
//   const playLists = ref<PlayLists>({});
//   const currentPlays = ref<CurrentPlays>({});

//   return {
//     playLists,
//     currentPlays,
//   };
// },{
//   actions: {
//     uploadPlayList(playListId: string) {
//       let data = {
//         playListId: playListId,
//         playListQueues: playLists[playListId].value,
//         currentPlays: currentPlays[playListId].value,
//       };
  
//       let config = {
//         method: "post",
//         maxBodyLength: Infinity,
//         url: "http://localhost:8080/api/v1/user_plays",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token.value}`,
//         },
//         data: data,
//       };
    
//       axios
//         .request(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   },
//   persist: true,
// });