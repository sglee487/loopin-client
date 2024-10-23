import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";
import { loadPlayList, ResponseData } from "../apis/videoList";

import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  decrement,
  increment,
  incrementAsync,
  selectCount,
  selectStatus,
} from "../features/counterSlice";

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
  console.log(playListData);

  const dispatch = useAppDispatch();
  const count = useAppSelector(selectCount);
  const status = useAppSelector(selectStatus);

  return (
    <div>
      <h1>YoutubeListItem</h1>
      <div>
        <span>{count}</span>
        <button
          onClick={() => {
            dispatch(decrement());
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            dispatch(increment());
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            dispatch(incrementAsync(1));
          }}
        >
          async increase
        </button>
      </div>
      <ReactPlayer url="https://www.youtube.com/watch?v=LXb3EKWsInQ" />
    </div>
  );
};

export default YoutubeListItem;
