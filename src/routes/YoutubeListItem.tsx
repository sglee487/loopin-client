import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { loadPlayList, ResponseData } from "../apis/videoList";

import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  downloadUserPlayListQueueAsync,
  initPlayListQueues,
  playNextQueue,
  selectCurrentPlays,
  selectPlayLists,
} from "../features/playsSlice";
import { useEffect } from "react";

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<{ playListData: ResponseData }> {
  const playListId = params.playListId; // params에서 playListId를 추출
  if (!playListId) {
    throw new Error("PlayList ID is required"); // playListId가 없을 때 처리
  }

  const playListData = await loadPlayList(playListId);
  return { playListData };
}

const YoutubeListItem = () => {
  const { playListData } = useLoaderData() as { playListData: ResponseData };

  const { playListId } = useParams();

  const dispatch = useAppDispatch();
  const userPlayLists = useAppSelector(selectPlayLists);
  const userCurrentPlays = useAppSelector(selectCurrentPlays);
  console.log(playListId);
  if (!playListId) return null;

  useEffect(() => {
    // _loadYoutubeLists();
  }, []);

  console.log(userCurrentPlays);
  console.log(userCurrentPlays[playListId]);

  if (
    userCurrentPlays[playListId] === undefined ||
    userCurrentPlays[playListId] === null
  ) {
    console.log(playListData);
    console.log(playListData.items);
    dispatch(
      initPlayListQueues({
        playListId: playListId,
        items: playListData.items,
      })
    );
    console.log(userCurrentPlays);
    console.log(userCurrentPlays[playListId]);
    console.log(userPlayLists);
    dispatch(playNextQueue(playListId));

    console.log(userCurrentPlays[playListId]);
  }

  if (userCurrentPlays)
    return (
      <div>
        <h1>YoutubeListItem</h1>
        {
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${userCurrentPlays[playListId]?.item?.resource.videoId}`}
          />
        }
      </div>
    );
};

export default YoutubeListItem;
