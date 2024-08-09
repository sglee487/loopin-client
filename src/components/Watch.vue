<script setup lang="ts">
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";

import axios from "axios";

const route = useRoute();

const videoInfo = ref({});
// const player = ref(null);
const serviceURL = inject("$serviceURL") as string;

onMounted(() => {
  axios.get(`${serviceURL}/video/${route.params.uuid}`).then((response) => {
    videoInfo.value = response.data;
  });
});

// const handleEvent = (log: any) => {
//   console.log("Basic player event", log);
// };

// const handleMounted = (payload: any) => {
//   player.value = payload.player;
// };
</script>

<template>
  <!-- <video-player
    class="video-player vjs-big-play-centered"
    :src="`http://localhost:8080/video-hls/${route.params.uuid}/index.m3u8`"
    :poster="
      videoInfo.thumbnail !== undefined
        ? `data:image/png;base64,${videoInfo.thumbnail}`
        : ''
    "
    crossorigin="anonymous"
    playsinline
    controls
    :volume="0.2"
    :height="320"
    :playback-rates="[0.7, 1.0, 1.5, 2.0]"
    autoplay="true"
    @mounted="handleMounted"
    @ready="handleEvent($event)"
    @play="handleEvent($event)"
    @pause="handleEvent($event)"
    @ended="handleEvent($event)"
    @loadeddata="handleEvent($event)"
    @waiting="handleEvent($event)"
    @playing="handleEvent($event)"
    @canplay="handleEvent($event)"
    @canplaythrough="handleEvent($event)"
    @timeupdate="handleEvent(player?.currentTime())"
  /> -->
</template>
