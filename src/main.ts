import { invoke } from "@tauri-apps/api/core";

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

const getFromRust = async (name: string) => {
  try {
    return await invoke("get_env", { name });
  } catch (e) {
    console.error("getFromRust", e);
  }

  return "";
};

const main = async () => {
  const oauthURL = (await getFromRust("TAURI_OAUTH_URL")) as string;
  const oauthRealm = (await getFromRust("TAURI_OAUTH_REALM")) as string;
  const oauthClientId = (await getFromRust("TAURI_OAUTH_CLIENT_ID")) as string;

  const serviceURL = (await getFromRust("TAURI_SERVICE_URL")) as string;

  // alert(`oauthURL: ${oauthURL}`);
  // alert(`oauthRealm: ${oauthRealm}`);
  // alert(`oauthClientId: ${oauthClientId}`);

  // alert(`serviceURL: ${serviceURL}`);

  const options = {
    url: oauthURL,
    realm: oauthRealm,
    clientId: oauthClientId,
  };

  // alert(`options: ${options}`);

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
  app.provide("$serviceURL", serviceURL);

  // Store keycloak user data into store
  keycloak
    .init({
      onLoad: "check-sso",
      redirectUri: window.location.origin + "/",
    })
    .then((e: any) => {
      console.log("Keycloak initialized");
      console.log(e);
    })
    .catch((e: any) => {
      console.error(e);
    })
    .finally(() => {
      app.use(pinia).use(router).use(VueVideoPlayer).use(timeago).mount("#app");
    });
};

main();
