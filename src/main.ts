import { createApp } from "vue";
import "./styles.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import VueVideoPlayer from "@videojs-player/vue";
import "video.js/dist/video-js.css";

// @ts-ignore
import timeago from "vue-timeago3";
import VideoListVue from "./components/VideoList.vue";
import WatchVue from "./components/Watch.vue";
import YoutubeListItem from "./components/YoutubeListItem.vue";
import AuthStorePlugin from "./plugins/authStore";
import keycloakService from "./services/keycloak";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "home", component: VideoListVue },
  { path: "/watch/:uuid", name: "watch", component: WatchVue },
  {
    path: "/playlist/:playListId",
    name: "youtubeListItem",
    component: YoutubeListItem,
  },
];

const router = createRouter({
  history: createWebHistory(), // Using HTML5 history mode
  routes,
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const renderApp = async () => {
  createApp(App)
    .use(pinia)
    .use(router)
    .use(VueVideoPlayer)
    .use(AuthStorePlugin, { pinia })
    .use(timeago)
    .mount("#app");
  await keycloakService.CallInit();
};

renderApp();
