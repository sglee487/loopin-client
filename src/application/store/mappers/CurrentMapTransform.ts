import { createTransform } from 'redux-persist';
import { CurrentPlayMap } from '@domain/entities/CurrentPlay';

export const CurrentMapTransform = createTransform<CurrentPlayMap, CurrentPlayMap>(
    // Outbound: Before saving to storage
    (inboundState) => {
      const serializedState = Object.entries(inboundState).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          prev: value.prev.map((item) => ({
            ...item,
            publishedAt: item.publishedAt instanceof Date
              ? item.publishedAt.toISOString()
              : item.publishedAt,
          })),
          next: value.next.map((item) => ({
            ...item,
            publishedAt: item.publishedAt instanceof Date
              ? item.publishedAt.toISOString()
              : item.publishedAt,
          })),
          nowPlayingItem: value.nowPlayingItem
            ? {
                ...value.nowPlayingItem,
                publishedAt: value.nowPlayingItem.publishedAt instanceof Date
                  ? value.nowPlayingItem.publishedAt.toISOString()
                  : value.nowPlayingItem.publishedAt,
              }
            : undefined,
          playlist: {
            ...value.playlist,
            publishedAt: value.playlist.publishedAt instanceof Date
              ? value.playlist.publishedAt.toISOString()
              : value.playlist.publishedAt,
          },
        };
        return acc;
      }, {} as Record<string, any>);
      return serializedState as CurrentPlayMap; // Cast to CurrentPlayMap
    },
    // Inbound: After loading from storage
    (outboundState) => {
      const deserializedState = Object.entries(outboundState).reduce((acc, [key, value]) => {
        acc[key] = {
          ...value,
          prev: value.prev.map((item) => ({
            ...item,
            publishedAt: new Date(item.publishedAt),
          })),
          next: value.next.map((item) => ({
            ...item,
            publishedAt: new Date(item.publishedAt),
          })),
          nowPlayingItem: value.nowPlayingItem
            ? {
                ...value.nowPlayingItem,
                publishedAt: new Date(value.nowPlayingItem.publishedAt),
              }
            : undefined,
          playlist: {
            ...value.playlist,
            publishedAt: new Date(value.playlist.publishedAt), // Deserialize Date
          },
        };
        return acc;
      }, {} as Record<string, any>);
      return deserializedState as CurrentPlayMap; // Cast to CurrentPlayMap
    },
    { whitelist: ['currentPlayMap'] }
  );
  