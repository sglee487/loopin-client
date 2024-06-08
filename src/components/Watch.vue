<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import videojs from "video.js";

const route = useRoute();

onMounted(() => {
  // initPlayer();
  console.log(route);
  console.log(route.params);
  console.log(route.params.uuid);
});

// const videoPlayer = ref(null);

// const initPlayer = (
//   options = {
//     controls: true,
//     autoplay: true,
//     preload: "auto",
//     fluid: true,
//     sources: [
//       {
//         src: `http://localhost:8080/video/${route.params.uuid}/index.m3u8`,
//         type: "application/x-mpegURL",
//       },
//     ],
//   },
// ) => {
//   videoPlayer.value = videojs(videoPlayer.value, options, () => {
//     console.log("onPlayerReady"); // Use console.log instead of this.player.log
//   });
// };

// onBeforeUnmount(() => {
//   console.log(videoPlayer.value);
//   // if (videoPlayer.value) {
//   //   videoPlayer.value.dispose();
//   // }
// });
</script>

<template>
  <div>watch</div>
  <!-- <video ref="videoPlayer" class="video-js"></video> -->
</template>
