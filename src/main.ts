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

import Keycloak from "keycloak-js";

const options = {
  url: import.meta.env.VITE_OAUTH_URL,
  realm: import.meta.env.VITE_OAUTH_REALM,
  clientId: import.meta.env.VITE_OAUTH_CLIENT_ID,
};

const keycloak = new Keycloak(options);

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

const app = createApp(App);

app.provide("$keycloak", keycloak);

// Store keycloak user data into store
keycloak
  .init({
    onLoad: "check-sso",
    redirectUri: window.location.origin + "/",
  })
  .then((e) => {
    console.log("Keycloak initialized");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(() => {
    app.use(pinia).use(router).use(VueVideoPlayer).use(timeago).mount("#app");
  });
