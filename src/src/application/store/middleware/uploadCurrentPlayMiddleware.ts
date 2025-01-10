import { Dispatch, Middleware, UnknownAction } from '@reduxjs/toolkit';
import { PlayItem } from '../../../domain/entities/PlayItem';
import { uploadCurrentPlay, uploadCurrentPlayStartSeconds } from '../../../infrastructure/api/services/currentPlayService';

// Define the middleware
const uploadCurrentPlayMiddleware: Middleware<{}, any, Dispatch<UnknownAction>> = (storeAPI) => (next) => async (action: any) => {
  const result = next(action);

  if (action.type === 'currentPlayMap/playSelectedPlayItem') {
    const payload = action.payload as { playlistId: string; selectedPlayItem: PlayItem };

    uploadCurrentPlay(payload.playlistId, storeAPI.getState().currentPlayMap.currentPlayMap[payload.playlistId]);

  } else if (action.type === 'currentPlayMap/setStartSeconds') {
    const payload = action.payload as { playlistId: string; startSeconds: number };
    uploadCurrentPlayStartSeconds(payload.playlistId, payload.startSeconds);
  }

  return result;
};

export default uploadCurrentPlayMiddleware;
