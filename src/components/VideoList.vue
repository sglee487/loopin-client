<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const videos = ref([]);

onMounted(async () => {
  const response = await axios.get("http://localhost:8080/videos");
  videos.value = response.data.content;
});
</script>

<template>
  <div>
    <div>
      <div v-for="video in videos" :key="video.id" class="h-20 w-16">
        <img
          :src="`data:image/png;base64,${video.thumbnail}`"
          width="310"
          height="174"
          alt="video thumbnail"
        />
        <div class="border border-red-500 text-red-400">{{ video.title }}</div>
      </div>
    </div>
  </div>
</template>
