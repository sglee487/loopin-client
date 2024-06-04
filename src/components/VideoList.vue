<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { HandThumbUpIcon, EyeIcon } from "@heroicons/vue/16/solid";

const videos = ref([]);

onMounted(async () => {
  const response = await axios.get("http://localhost:8080/videos");
  videos.value = response.data.content;
});

const numberToTIme = (number) => {
  const hours = Math.floor(number / 3600);
  const minutes = Math.floor((number % 3600) / 60);
  const seconds = Math.floor(number % 60);

  return `${hours ? `${hours}:` : ""}${minutes}:${seconds}`;
};
</script>

<template>
  <div>
    <div class="flex flex-wrap space-x-2">
      <div v-for="video in videos" :key="video.id" class="h-64 w-80">
        <div class="relative w-80">
          <img
            class="h-44 w-80 rounded-xl object-fill"
            :src="`data:image/png;base64,${video.thumbnail}`"
            alt="video thumbnail"
          />
          <div
            class="absolute bottom-2 right-2 rounded-md bg-slate-600 bg-opacity-50 px-1 text-sm text-white"
          >
            {{ numberToTIme(video.videoInfo.duration) }}
          </div>
        </div>
        <div class="flex flex-col">
          <BeakerIcon />
          <div class="text-right text-xs">
            <HandThumbUpIcon class="inline w-4" /> {{ video.like }} &nbsp;
            <EyeIcon class="inline w-4" /> {{ video.hit }}
          </div>
          <div class="font-bold">{{ video.title }}</div>
          <div>{{ video.author }}</div>
          <timeago class="text-sm" :datetime="video.uploadedAt" />
        </div>
      </div>
    </div>
  </div>
</template>
