<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { invoke } from "@tauri-apps/api/core";
import videojs from "video.js";

const greetMsg = ref("");
const name = ref("");

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsg.value = await invoke("greet", { name: name.value });
}

async function downloadVideo() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  await invoke("download_video");
}

const videoPlayer = ref(null);

const initPlayer = (
  options = {
    controls: true,
    autoplay: true,
    preload: "auto",
    fluid: true,
    sources: [
      {
        src: "http://localhost:8080/video/1890-151167947_small/index.m3u8",
        type: "application/x-mpegURL",
      },
    ],
  }
) => {
  videoPlayer.value = videojs(videoPlayer.value, options, () => {
    console.log("onPlayerReady"); // Use console.log instead of this.player.log
  });
};

onMounted(() => {
  initPlayer();
});

onBeforeUnmount(() => {
  if (videoPlayer.value) {
    videoPlayer.value.dispose();
  }
});
</script>

<template>
  <button @click="downloadVideo">Download Video</button>

  <form class="row" @submit.prevent="greet">
    <input id="greet-input" v-model="name" placeholder="Enter a name..." />
    <button type="submit">Greet</button>
  </form>

  <div>
    <video ref="videoPlayer" class="video-js"></video>
  </div>

  <p>{{ greetMsg }}</p>
</template>
