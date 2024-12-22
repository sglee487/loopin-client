import axios from 'axios';
import { NewPlayItem } from '../../../domain/entities/NewPlayItem';

export const fetchPlayItems = async (): Promise<NewPlayItem[]> => {
  const response = await axios.get('http://localhost:8080/api/v1/playlist/batch?size=50');
  return response.data.data.content.map((item: any) => ({
    ...item,
    playListId: item.playlistId,
    publishedAt: new Date(item.publishedAt),
    resource: {
      kind: 'youtube#video',
      videoId: ''
    },
    startSeconds: 0
  }));
};