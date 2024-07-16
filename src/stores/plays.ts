import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PlayLists, CurrentPlays } from '../types'

export const usePlaysStore = defineStore('plays', () => {
  const playLists = ref<PlayLists>({});
  const currentPlays = ref<CurrentPlays>({});

  return {
    playLists,
    currentPlays,
  };
},{
  persist: true,
});