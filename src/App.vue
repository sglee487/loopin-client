<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/16/solid";

import { useRouter } from "vue-router";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const goForward = () => {
  router.go(+1);
};

const goHome = () => {
  router.push({ name: "home" });
};
</script>

<template>
  <div class="container">
    <div class="cursor-pointer text-red-500" @click="goHome">snservice</div>
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
