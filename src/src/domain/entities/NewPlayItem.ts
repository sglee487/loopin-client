export interface NewPlayItem {
    publishedAt: Date;
    channelId: string;
    title: string;
    description?: string;
    thumbnail?: string; // URL as string
    channelTitle: string;
    playListId: string;
    position: number;
    resource: Resource;
    videoOwnerChannelId?: string;
    videoOwnerChannelTitle?: string;
    startSeconds: number;
  }

  export interface Resource {
    kind: string;
    videoId: string;
  }