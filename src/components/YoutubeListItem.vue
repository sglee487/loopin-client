<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
} from "@heroicons/vue/16/solid";
import { usePlaysStore } from "../store/plays";
import { PlayListItem } from "../types";

import axios from "axios";
const route = useRoute();
const playsStore = usePlaysStore();

const playerContainer = ref<HTMLElement | null>(null);
let player: any = null;

const playListId: string = route.params.playListId as string;

const onYouTubeIframeAPIReady = (videoId: string, startSeconds: number) => {
  // parse to int
  startSeconds = parseInt(startSeconds.toString());

  player = new YT.Player(playerContainer.value!, {
    height: "390",
    width: "640",
    videoId: videoId,
    playerVars: {
      autoplay: 1,
      start: startSeconds,
    },
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
};

// 플레이어 상태가 변경된 후 호출되는 함수
const onPlayerStateChange = (event: any) => {
  // -1: 시작되지 않음, 0: 종료, 1: 재생 중, 2: 일시중지, 3: 버퍼링 중, 5: 동영상 신호
  if (
    playsStore.currentPlays[playListId].item === null ||
    playsStore.currentPlays[playListId].item === undefined
  ) {
    return;
  }
  if (event.data === -1) {
    if (event.target.playerInfo.videoData.errorCode !== null) {
      console.log("Error:", event.target.playerInfo.videoData.errorCode);
      // 다음 동영상 재생
      playsStore.playLists[playListId].prev.push(
        playsStore.currentPlays[playListId].item,
      );
      playsStore.currentPlays[playListId].item =
        playsStore.playLists[playListId].next.shift();
      if (playsStore.currentPlays[playListId].item) {
        player.loadVideoById({
          videoId: playsStore.currentPlays[playListId].item.resource.videoId,
        });
      }
    }
  }
  if (event.data === 0) {
    // 다음 동영상 재생
    playsStore.playLists[playListId].prev.push(
      playsStore.currentPlays[playListId].item as PlayListItem,
    );
    playsStore.currentPlays[playListId].item =
      playsStore.playLists[playListId].next.shift();
    if (playsStore.currentPlays[playListId].item) {
      player.loadVideoById({
        videoId: playsStore.currentPlays[playListId].item.resource.videoId,
      });
    }
  }
};

onMounted(async () => {
  if (!Object.keys(playsStore.playLists).includes(playListId)) {
    // playsStore.playLists[playListId] = {
    //   prev: [],
    //   next: [],
    // };

    await loadPlaylist();
  }

  if (playsStore.currentPlays[playListId].item === null) {
    playsStore.currentPlays[playListId].item =
      playsStore.playLists[playListId].next.shift();
  }

  onYouTubeIframeAPIReady(
    playsStore.currentPlays[playListId]?.item?.resource.videoId ?? "",
    playsStore.currentPlays[playListId].startSeconds,
  );
});

onBeforeUnmount(() => {
  playsStore.currentPlays[playListId].startSeconds = player.getCurrentTime();

  player.destroy();
});

interface ResponseData {
  playListId: string;
  channelId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  localized: {
    title: string;
    description: string;
  };
  contentDetails: {
    itemCount: number;
  };
  items: PlayListItem[];
  publishedAt: string;
  updatedAt: string;
}

const loadPlaylist = async (refresh: boolean = false) => {
  const response = await axios.get(
    `http://localhost:8080/listitems?playlistId=${playListId}`,
  );

  const data: ResponseData = response.data;

  playsStore.currentPlays[playListId] = {
    playListId: data.playListId,
    channelId: data.channelId,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail,
    channelTitle: data.channelTitle,
    localized: data.localized,
    contentDetails: data.contentDetails,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    startSeconds: 0,
    item:
      playsStore.currentPlays[playListId] !== undefined
        ? playsStore.currentPlays[playListId].item
        : null,
  };

  if (playsStore.playLists[playListId] === undefined) {
    playsStore.playLists[playListId] = {
      prev: [],
      next: data.items,
    };
  }

  const allItems = data.items;
  const playList = playsStore.playLists[playListId];

  // if item that in allItems not in both prev and next, add it to next
  allItems.forEach((item) => {
    const videoId = item.resource.videoId;
    const isInPrev = playList.prev.some(
      (prevItem) => prevItem.resource.videoId === videoId,
    );
    const isInNext = playList.next.some(
      (nextItem) => nextItem.resource.videoId === videoId,
    );
    const isNowPlaying =
      playsStore.currentPlays[playListId]?.item?.resource.videoId === videoId;

    if (!isInPrev && !isInNext && !isNowPlaying) {
      playList.next.push(item);
    }
  });

  // if item.resource.videoId that in prev is not in allItems, remove it from prev
  const allVideoIds = allItems.map((item) => item.resource.videoId);
  playList.prev = playList.prev.filter((prevItem) =>
    allVideoIds.includes(prevItem.resource.videoId),
  );

  // if item.resource.videoId that in next is not in allItems, remove it from next
  playList.next = playList.next.filter((nextItem) =>
    allVideoIds.includes(nextItem.resource.videoId),
  );

  if (playsStore.currentPlays[playListId].item === null) {
    playsStore.currentPlays[playListId].item =
      playsStore.playLists[playListId].next.shift();
  }
};

function shuffleArray<T>(array: T[]): T[] {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const shuffleNext = () => {
  playsStore.playLists[playListId].next = shuffleArray(
    playsStore.playLists[playListId].next,
  );
};

const prevVideo = () => {
  if (
    playsStore.currentPlays[playListId].item === null ||
    playsStore.currentPlays[playListId].item === undefined
  ) {
    return;
  }
  playsStore.playLists[playListId].next.unshift(
    playsStore.currentPlays[playListId].item,
  );

  playsStore.currentPlays[playListId].item =
    playsStore.playLists[playListId].prev.shift();
  if (playsStore.currentPlays[playListId].item) {
    playsStore.currentPlays[playListId].startSeconds = 0;
    player.loadVideoById({
      videoId: playsStore.currentPlays[playListId].item.resource.videoId,
      startSeconds: playsStore.currentPlays[playListId].startSeconds,
    });
  }
};

const nextVideo = () => {
  if (
    playsStore.currentPlays[playListId].item === null ||
    playsStore.currentPlays[playListId].item === undefined
  ) {
    return;
  }
  playsStore.playLists[playListId].prev.unshift(
    playsStore.currentPlays[playListId].item,
  );

  playsStore.currentPlays[playListId].item =
    playsStore.playLists[playListId].next.shift();
  if (playsStore.currentPlays[playListId]) {
    playsStore.currentPlays[playListId].startSeconds = 0;
    player.loadVideoById({
      videoId: playsStore.currentPlays[playListId]?.item?.resource.videoId,
      startSeconds: playsStore.currentPlays[playListId].startSeconds,
    });
  }
};

const redownload = () => {
  loadPlaylist(true);
};

const resetPlayList = async () => {
  delete playsStore.playLists[playListId];
  delete playsStore.currentPlays[playListId];
  player.destroy();
  await loadPlaylist(true);
  onYouTubeIframeAPIReady(
    playsStore.currentPlays[playListId]?.item?.resource.videoId ?? "",
    playsStore.currentPlays[playListId].startSeconds,
  );
};

// save startSeconds in every 5 seconds
setInterval(() => {
  if (player) {
    playsStore.currentPlays[playListId].startSeconds = player.getCurrentTime();
  }
}, 5000);
</script>

<template>
  <div
    v-show="
      playsStore.playLists[playListId] && playsStore.currentPlays[playListId]
    "
  >
    <div ref="playerContainer"></div>
    <div class="flex space-x-1">
      <ChevronDoubleLeftIcon
        class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
        @click="prevVideo"
      />
      <ChevronDoubleRightIcon
        class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
        @click="nextVideo"
      />
      <ArrowPathIcon
        class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
        @click="resetPlayList"
      />
    </div>
    <div class="flex w-[1200px]">
      <div v-if="playsStore.playLists[playListId]">
        <p>이전</p>
        <div>
          {{ playsStore.playLists[playListId].prev }}
        </div>
        <div
          v-if="playsStore.playLists[playListId].prev"
          v-for="item in playsStore.playLists[playListId].prev"
        >
          <p>{{ item }}</p>
        </div>
      </div>
      <div
        class="w-[400px] rounded-md border"
        v-if="
          playsStore.currentPlays[playListId] &&
          playsStore.playLists[playListId]
        "
      >
        <p class="text-sm">다음</p>
        <div class="bg-slate-100 p-2">
          <p class="font-bold">
            {{ playsStore.currentPlays[playListId].title }}
          </p>
          <p class="text-xs text-gray-500">
            {{ playsStore.currentPlays[playListId].channelTitle }} ·
            {{ playsStore.playLists[playListId]?.next.length ?? 0 }} /
            {{
              playsStore.currentPlays[playListId]?.contentDetails?.itemCount ??
              0
            }}
          </p>
          <div class="flex justify-between">
            <div class="inline-block">
              <img
                class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                src="../assets/shuffle.svg"
                @click="shuffleNext"
              />
            </div>
            <ArrowDownTrayIcon
              class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
              @click="redownload"
            />
          </div>
        </div>
        <div class="h-[460px] overflow-scroll">
          <div
            class="py-0.5"
            v-for="(item, i) in playsStore.playLists[playListId].next"
          >
            <div class="flex">
              <div class="w-10 flex-none self-center text-center">
                {{ i }}
              </div>
              <img
                class="h-[56.25px] w-[100px] flex-none p-0.5"
                :src="item.thumbnail"
                :alt="item.title"
              />
              <div class="flex shrink flex-col">
                <p class="line-clamp-2">{{ item.title }}</p>
                <p class="text-xs text-gray-500">
                  {{ item.videoOwnerChannelTitle }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
