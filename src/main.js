import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";

import { createRouter, createWebHistory } from "vue-router";

import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";

import timeago from "vue-timeago3";
import VideoListVue from "./components/VideoList.vue";
import WatchVue from "./components/Watch.vue";

const routes = [
  { path: "/", name: "home", component: VideoListVue },
  { path: "/watch/:uuid", name: "watch", component: WatchVue },
];

const router = createRouter({
  history: createWebHistory(), // Using HTML5 history mode
  routes,
});

createApp(App).use(router).use(VueVideoPlayer).use(timeago).mount("#app");
