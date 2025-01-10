import axios from 'axios';
import { CurrentPlay } from '../../../domain/entities/CurrentPlay';

// export const uploadCurrentPlay = async (): Promise<Playlist[]> => {
//   const response = await axios.post('http://localhost:8080/api/v1/current-plays', {

//   });
//   return response.data.data.content.map((item: any) => ({
//     ...item,
//     playListId: item.playlistId,
//     publishedAt: new Date(item.publishedAt),
//     updatedAt: new Date(item.publishedAt),
//   }));
// };

export const uploadCurrentPlay = async (playlistId: string, currentPlay: CurrentPlay): Promise<undefined> => {
  const data = {
    nowPlayingItem: currentPlay.nowPlayingItem,
    prevItemIdList: currentPlay.prev.map((item) => item.resource.videoId),
    nextItemIdList: currentPlay.next.map((item) => item.resource.videoId),
  }

  console.log(data);

  const result = await axios.post(`http://localhost:8080/api/v1/current-plays/${playlistId}`, data);
  console.log(result);
};

export const uploadCurrentPlayStartSeconds = async (playlistId: string, startSeconds: number): Promise<undefined> => {
  await axios.post(`http://localhost:8080/api/v1/current-plays/${playlistId}/start-seconds`, {
    startSeconds: startSeconds,
  });
}

// export const pullCurrentPlayMap = async (id: string): Promise<Playlist> => {
//   const response = await axios.get(`http://localhost:8080/api/v1/playlists/${id}`);
//   const item = response.data.data;
//   return {
//     ...item,
//     playListId: item.playlistId,
//     publishedAt: new Date(item.publishedAt),
//     updatedAt: new Date(item.updatedAt),
//   };
// };