<script setup lang="ts">
import { invoke } from "@tauri-apps/api/core";

import { ref, onMounted, computed, onUnmounted, inject } from "vue";
import { useRoute } from "vue-router";
import {
  ChevronDoubleLeftIcon,
  PlayPauseIcon,
  ChevronDoubleRightIcon,
  ArrowTopRightOnSquareIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowUpTrayIcon,
} from "@heroicons/vue/16/solid";

import { usePlaysStore } from "../stores/playsStore";
import { PlayListItem } from "../types";

import YoutubeVideoCard from "./YoutubeVideoCard.vue";

import Keycloak from "keycloak-js";
import axios from "axios";

enum PlayListType {
  prev = "prev",
  next = "next",
}

const keycloak = inject("$keycloak") as Keycloak;
const serviceURL = inject("$serviceURL") as string;

const route = useRoute();
const playsStore = usePlaysStore();

console.log(playsStore.playLists);
console.log(playsStore.currentPlays);

const playerContainer = ref<HTMLElement | null>(null);
let player: any = null;

const playListId: string = route.params.playListId as string;

const reversedPrevList = computed(() =>
  playsStore.playLists[playListId]?.prev.slice().reverse(),
);

const onYouTubeIframeAPIReady = async (
  videoId: string,
  startSeconds: number,
) => {
  // parse to int
  startSeconds = parseInt(startSeconds.toString());

  // wait until YT is not undefined
  while (typeof YT === "undefined" || typeof YT.Player === "undefined") {
    console.log("YT is undefined");
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  player = new YT.Player(playerContainer.value!, {
    height: "240",
    width: "240",
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
      console.log(playsStore.currentPlays[playListId].item);
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

      if (keycloak.authenticated) {
        uploadUserPlays({ startSeconds: 0 });
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
  if (keycloak.authenticated) {
    await playsStore.downloadUserPlayListQueues(playListId, keycloak.token);
  }

  if (!Object.keys(playsStore.playLists).includes(playListId)) {
    playsStore.playLists[playListId] = {
      prev: [],
      next: [],
    };
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
  console.log(refresh);
  const response = await axios.get(
    `${serviceURL}/api/v1/list/listitems?playlistId=${playListId}`,
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

    if (keycloak.authenticated) {
      uploadUserPlays({ startSeconds: 0 });
    }
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

    if (keycloak.authenticated) {
      uploadUserPlays({ startSeconds: 0 });
    }
  }
};

const uploadUserPlays = async ({
  startSeconds = null,
}: {
  startSeconds?: number | null;
}) => {
  if (startSeconds !== null) {
    playsStore.currentPlays[playListId].startSeconds = startSeconds;
  }

  if (keycloak.authenticated) {
    playsStore.uploadUserPlays(playListId, keycloak.token);
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

const playSelectVideo = (item: PlayListItem, type: PlayListType) => {
  if (
    playsStore.currentPlays[playListId].item === null ||
    playsStore.currentPlays[playListId].item === undefined
  ) {
    return;
  }
  if (type == PlayListType.prev) {
    playsStore.playLists[playListId].prev.push(
      playsStore.currentPlays[playListId].item,
    );
    playsStore.currentPlays[playListId].item = item;
    // remove it in prev
    playsStore.playLists[playListId].prev = playsStore.playLists[
      playListId
    ].prev.filter(
      (prevItem) => prevItem.resource.videoId !== item.resource.videoId,
    );
    playsStore.currentPlays[playListId].startSeconds = 0;
    player.loadVideoById({
      videoId: item.resource.videoId,
    });
  }
  if (type == PlayListType.next) {
    playsStore.playLists[playListId].prev.push(
      playsStore.currentPlays[playListId].item,
    );
    playsStore.currentPlays[playListId].item = item;
    // remove it in next
    playsStore.playLists[playListId].next = playsStore.playLists[
      playListId
    ].next.filter(
      (nextItem) => nextItem.resource.videoId !== item.resource.videoId,
    );
    playsStore.currentPlays[playListId].startSeconds = 0;
    player.loadVideoById({
      videoId: item.resource.videoId,
    });
  }
};

const goToExternal = () => {
  playsStore.currentPlays[playListId].item!;

  const url = `https://www.youtube.com/watch?v=${playsStore.currentPlays[playListId].item!.resource.videoId}`;
  invoke("open_in_default_browser", { url });
};

// save startSeconds in every 5 seconds
// and in every 30 seconds, upload user plays
// in one interval
let uploadCounter = 0;

setInterval(() => {
  if (player) {
    playsStore.currentPlays[playListId].startSeconds = player.getCurrentTime();
  }

  if (uploadCounter >= 6) {
    // 5초 * 6 = 30초
    if (keycloak.authenticated && player.state === 1) {
      uploadUserPlays({ startSeconds: player.getCurrentTime() });
    }
    uploadCounter = 0; // Reset the counter
  }

  uploadCounter++;
}, 5 * 1000);

onUnmounted(() => {
  if (player) {
    playsStore.currentPlays[playListId].startSeconds = player.getCurrentTime();
    if (keycloak.authenticated) {
      uploadUserPlays({ startSeconds: player.getCurrentTime() });
    }
  }
  player.destroy();
});
</script>

<template>
  <div
    v-show="
      playsStore.playLists[playListId] && playsStore.currentPlays[playListId]
    "
  >
    <div
      v-if="
        playsStore.currentPlays[playListId] !== null &&
        playsStore.currentPlays[playListId] !== undefined &&
        playsStore.currentPlays[playListId].item !== null &&
        playsStore.currentPlays[playListId].item !== undefined
      "
      class="flex"
    >
      <div class="rounded-md bg-purple-200 p-2">
        <div ref="playerContainer"></div>
      </div>
      <div class="flex flex-col justify-end p-2">
        <ArrowTopRightOnSquareIcon
          class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
          @click="goToExternal"
        />
        <div class="line-clamp-2 text-3xl font-extralight">
          {{ playsStore.currentPlays[playListId].item!.title }}
        </div>
        <div class="font-bold">
          {{ playsStore.currentPlays[playListId].item!.videoOwnerChannelTitle }}
        </div>
        <div class="my-1 border-b border-transparent"></div>
        <div class="line-clamp-2">
          {{ playsStore.currentPlays[playListId].item!.description }}
        </div>
        <div class="flex space-x-1">
          <ChevronDoubleLeftIcon
            class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
            @click="prevVideo"
          />
          <PlayPauseIcon
            class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
            @click="
              player.getPlayerState() === 1
                ? player.pauseVideo()
                : player.playVideo()
            "
          ></PlayPauseIcon>
          <ChevronDoubleRightIcon
            class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
            @click="nextVideo"
          />
          <div class="grow"></div>
          <ArrowPathIcon
            class="inline-block h-10 w-10 cursor-pointer place-self-end p-2 hover:bg-slate-200"
            @click="resetPlayList"
          />
        </div>
      </div>
    </div>
    <div class="flex w-[1200px]">
      <div
        class="w-[320px] rounded-md border"
        v-if="
          playsStore.currentPlays[playListId] &&
          playsStore.playLists[playListId]
        "
      >
        <p class="text-sm">이전</p>
        <div class="bg-slate-100 p-2">
          <p class="font-bold">
            {{ playsStore.currentPlays[playListId].title }}
          </p>
          <p class="text-xs text-gray-500">
            {{ playsStore.playLists[playListId]?.prev.length ?? 0 }} /
            {{
              playsStore.currentPlays[playListId]?.contentDetails?.itemCount ??
              0
            }}
          </p>
        </div>
        <div class="h-[460px] overflow-scroll">
          <div
            class="py-0.5"
            v-if="playsStore.playLists[playListId].prev"
            v-for="(item, i) in reversedPrevList"
          >
            <YoutubeVideoCard
              :index="i"
              :playListItem="item"
              @click="playSelectVideo(item, PlayListType.prev)"
            />
          </div>
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
            <ArrowUpTrayIcon
              class="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
              @click="
                uploadUserPlays({ startSeconds: player.getCurrentTime() })
              "
            />
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
            <YoutubeVideoCard
              :index="i"
              :playListItem="item"
              @click="playSelectVideo(item, PlayListType.next)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
