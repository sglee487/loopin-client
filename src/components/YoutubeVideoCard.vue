<script setup lang="ts">
import { PlayListItem } from "../types";

interface Props {
  index: number;
  playListItem: PlayListItem;
}

// Props를 정의합니다
const props = defineProps<Props>();
</script>

<template>
  <div class="flex cursor-pointer hover:bg-slate-200">
    <div class="w-8 flex-none self-center text-center text-sm">
      {{ props.index }}
    </div>
    <img
      class="h-[56.25px] w-[100px] flex-none p-0.5"
      :src="props.playListItem.thumbnail"
      :alt="props.playListItem.title"
    />
    <div class="flex shrink flex-col">
      <p class="line-clamp-2">{{ props.playListItem.title }}</p>
      <p class="text-xs text-gray-500">
        {{ props.playListItem.videoOwnerChannelTitle }}
      </p>
    </div>
  </div>
</template>
