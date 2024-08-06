<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/16/solid";

import { inject } from "vue";
import { useRouter } from "vue-router";

import { usePlaysStore } from "./stores/playsStore";
import Keycloak from "keycloak-js";

const router = useRouter();
const keycloak = inject("$keycloak") as Keycloak;
const playsStore = usePlaysStore();

const keycloakView = async () => {
  console.log(keycloak);
  console.log(keycloak.authenticated);
};

const goBack = () => {
  router.go(-1);
};

const goForward = () => {
  router.go(+1);
};

const goHome = () => {
  router.push({ name: "home" });
};

// refresh access token every 5 minutes
// if access token - 5 minutes < current time, refresh token
const refreshUserToken = async () => {
  if (keycloak.authenticated && keycloak.token && keycloak.tokenParsed?.exp) {
    const currentTime = new Date().getTime();
    const tokenExpireTime = keycloak.tokenParsed?.exp * 1000;
    if (tokenExpireTime - 5 * 60 * 1000 < currentTime) {
      await keycloak.updateToken();
    }
  }
};

setInterval(
  async () => {
    await refreshUserToken();
  },
  5 * 60 * 1000,
);
</script>

<template>
  <div class="container">
    <div class="w-fit cursor-pointer text-red-500" @click="goHome">
      snservice
    </div>
    {{ keycloak.tokenParsed?.email }}
    <div @click="keycloakView">keycloakview</div>
    <div v-if="keycloak.authenticated">
      <div @click="keycloak.logout()">keycloakLogout</div>
      <div @click="keycloak.updateToken()">refresh token</div>
    </div>
    <div v-else>
      <div @click="keycloak.login()">keycloakLogin</div>
    </div>
    <div>
      <ChevronLeftIcon
        class="inline-block h-6 w-6 cursor-pointer"
        @click="goBack"
      />
      <ChevronRightIcon
        class="inline-block h-6 w-6 cursor-pointer"
        @click="goForward"
      />
    </div>
    <router-view />
  </div>
</template>
