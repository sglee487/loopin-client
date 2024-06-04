<script setup>
import Greet from "./components/Greet.vue";
import VideoList from "./components/VideoList.vue";
</script>

<template>
  <div class="container">
    <div class="text-red-500">red text</div>
    <div class="text-blue-500 font-extrabold">blue text</div>
    <VideoList />
  </div>
</template>

<style>
.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity));
}
</style>
