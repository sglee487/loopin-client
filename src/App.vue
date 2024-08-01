<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/16/solid";

import { getCurrentInstance, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

import { usePlaysStore } from "./stores/playsStore";
import { AuthStoreType } from "./stores/authStore";

const router = useRouter();

const instance = getCurrentInstance();
const authStore: AuthStoreType =
  instance?.appContext.config.globalProperties.$store;
const playsStore = usePlaysStore();

watch(
  () => authStore.authenticated,
  async (authenticated) => {
    if (authenticated) {
      await playsStore.downloadUserCurrentPlays(authStore.user.token);
    }
  },
);

const keycloakView = async () => {
  console.log(authStore.user);
  console.log(authStore.user.token);
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
  if (authStore.authenticated && authStore.user.tokenExp) {
    const currentTime = new Date().getTime();
    const tokenExpireTime = authStore.user.tokenExp * 1000;
    if (tokenExpireTime - 5 * 60 * 1000 < currentTime) {
      await authStore.refreshUserTokenWithEndpoint();
    }
  }
};

setInterval(
  async () => {
    await refreshUserToken();
  },
  5 * 60 * 1000,
);

onMounted(async () => {
  await refreshUserToken();
  if (authStore.authenticated) {
    playsStore.downloadUserCurrentPlays(authStore.user.token);
  }
});
</script>

<template>
  <div class="container">
    <div class="w-fit cursor-pointer text-red-500" @click="goHome">
      snservice
    </div>
    <div @click="keycloakView">keycloakview</div>
    <div v-if="authStore.authenticated">
      <div>{{ authStore.user }}</div>
      <div @click="authStore.logout()">keycloakLogout</div>
      <div @click="authStore.refreshUserTokenWithEndpoint()">refresh token</div>
    </div>
    <div v-else>
      <div @click="authStore.login()">keycloakLogin</div>
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
