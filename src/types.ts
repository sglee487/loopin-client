interface PlayListItem {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnail: string;
  playListId: string;
  position: number;
  resource: {
    kind: string;
    videoId: string;
  };
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

// 플레이리스트의 구조 정의
interface PlayList {
  prev: PlayListItem[];
  next: PlayListItem[];
}

// 전체 플레이리스트 객체의 타입 정의
interface PlayLists {
  [key: string]: PlayList;
}

interface CurrentPlay {
  startSeconds: number;
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
  item: PlayListItem | null | undefined;
  publishedAt: string;
  updatedAt: string;
}

interface CurrentPlays {
  [key: string]: CurrentPlay;
}

export type { PlayListItem, PlayList, PlayLists, CurrentPlay, CurrentPlays };