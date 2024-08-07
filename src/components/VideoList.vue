<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import {
  HandThumbUpIcon,
  EyeIcon,
  ListBulletIcon,
} from "@heroicons/vue/16/solid";

const videos = ref([]);
const youtubeLists = ref<any>([]);

onMounted(async () => {
  const response = await axios.get(
    `${import.meta.env.VITE_SERVICE_URL}/api/v1/video/videos`,
  );
  videos.value = response.data.content;
  const youtubeResponse = await axios.get(
    `${import.meta.env.VITE_SERVICE_URL}/api/v1/list/lists`,
  );
  youtubeLists.value = youtubeResponse.data.content;
});

// const numberToTime = (number: number) => {
//   const hours = Math.floor(number / 3600);
//   const minutes = Math.floor((number % 3600) / 60);
//   const seconds = Math.floor(number % 60);

//   return `${hours ? `${hours}:` : ""}${minutes}:${seconds}`;
// };
</script>

<template>
  <div>
    <div class="flex flex-wrap space-x-2">
      <!-- <router-link
        :to="{ name: 'watch', params: { uuid: video.uuid } }"
        v-for="video in videos"
        :key="video.id"
        class="w-80 cursor-pointer"
      >
        <div class="relative w-80">
          <img
            class="h-[180px] w-[320px] rounded-xl object-fill"
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
          <div class="text-right text-xs">
            <HandThumbUpIcon class="inline w-4" /> {{ video.like }} &nbsp;
            <EyeIcon class="inline w-4" /> {{ video.hit }}
          </div>
          <div class="font-bold">{{ video.title }}</div>
          <div>{{ video.author }}</div>
          <timeago class="text-sm" :datetime="video.uploadedAt" />
        </div>
      </router-link> -->
    </div>
    <div class="py-2 text-lg font-extrabold text-red-500">youtube</div>
    <div class="flex flex-wrap space-x-2">
      <router-link
        :to="{
          name: 'youtubeListItem',
          params: { playListId: youtubeList.playListId },
        }"
        v-for="youtubeList in youtubeLists"
        :key="youtubeList.playListId"
        class="h-80 w-80 cursor-pointer"
      >
        <div class="relative w-80">
          <img
            class="h-[180px] w-[320px] rounded-xl object-fill"
            :src="youtubeList.thumbnail"
            alt="video thumbnail"
          />
        </div>
        <div class="flex flex-col">
          <div class="text-right text-xs">
            <HandThumbUpIcon class="inline w-4" /> 0 &nbsp;
            <EyeIcon class="inline w-4" /> 0 &nbsp;
            <ListBulletIcon class="inline w-4" />
            {{ youtubeList.contentDetails.itemCount }}
          </div>
          <div class="font-bold">{{ youtubeList.title }}</div>
          <div>{{ youtubeList.channelTitle }}</div>
          <timeago class="text-sm" :datetime="youtubeList.publishedAt" />
        </div>
      </router-link>
    </div>
  </div>
</template>
