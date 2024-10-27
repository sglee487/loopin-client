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
  setStartSeconds,
} from "../features/playsSlice";
import { useEffect, useMemo } from "react";
import { useKeycloak } from "@react-keycloak/web";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpTrayIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  PlayPauseIcon,
} from "@heroicons/react/16/solid";
import YoutubeVideoCard from "../components/YoutubeVideoCard";

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
  const { keycloak, initialized } = useKeycloak();
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

  const reversedPrevList = useMemo(
    () => userPlayLists[playListId]?.prev.slice().reverse() || [],
    [userPlayLists, playListId]
  );

  const youtubePlayerCallback = (e: {
    played: number;
    playedSeconds: number;
    loaded: number;
    loadedSeconds: number;
  }) => {
    try {
      dispatch(
        setStartSeconds({
          token: keycloak.token,
          playListId: playListId,
          startSeconds: e.playedSeconds,
        })
      );
    } catch (e) {
      console.error(e);
    }
  };

  if (userCurrentPlays)
    return (
      <div>
        <div className="flex">
          {
            <ReactPlayer
              width="350px"
              height="240px"
              playing={true}
              config={{
                youtube: {
                  playerVars: {
                    start: Math.trunc(
                      userCurrentPlays[playListId].startSeconds
                    ),
                  },
                },
              }}
              controls={true}
              onProgress={youtubePlayerCallback}
              progressInterval={5000}
              url={`https://www.youtube.com/watch?v=${userCurrentPlays[playListId]?.item?.resource.videoId}`}
            />
          }
          <div className="flex flex-col justify-end p-2">
            <ArrowTopRightOnSquareIcon className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200" />
            <h2 className="line-clamp-2">
              {userCurrentPlays[playListId].item!.title}
            </h2>
            <h4>{userCurrentPlays[playListId].item!.videoOwnerChannelTitle}</h4>
            <div className="my-1 border-b border-transparent"></div>
            <div className="line-clamp-2">
              {userCurrentPlays[playListId].item!.description}
            </div>
            <div className="flex space-x-1">
              <ChevronDoubleLeftIcon className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200" />
              <PlayPauseIcon className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"></PlayPauseIcon>
              <ChevronDoubleRightIcon className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200" />
              <div className="grow"></div>
              <ArrowPathIcon className="inline-block h-10 w-10 cursor-pointer place-self-end p-2 hover:bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="flex w-[1200px]">
          <div className="w-[320px] rounded-md border">
            <small>이전</small>
            <div className="p-2">
              <b>{userCurrentPlays[playListId].title}</b>
              <small>
                {userPlayLists[playListId]?.prev.length ?? 0} /
                {userCurrentPlays[playListId]?.contentDetails?.itemCount ?? 0}
              </small>
            </div>
            <div className="h-[460px] overflow-scroll">
              {userPlayLists[playListId]?.prev &&
                reversedPrevList.map((item, i) => (
                  <div className="py-0.5" key={i}>
                    <YoutubeVideoCard index={i} playListItem={item} />
                  </div>
                ))}
            </div>
          </div>
          <div className="w-[400px] rounded-md border">
            <small>다음</small>
            <div className="p-2">
              <b>{userCurrentPlays[playListId].title}</b>
              <small className="text-gray-500">
                {userCurrentPlays[playListId].channelTitle} ·
                {userPlayLists[playListId]?.next.length ?? 0} /
                {userCurrentPlays[playListId]?.contentDetails?.itemCount ?? 0}
              </small>
              <div className="flex justify-between">
                <div className="inline-block">
                  <img
                    className="inline-block h-10 w-10 cursor-pointer p-2"
                    src="../assets/shuffle.svg"
                  />
                </div>
                <ArrowUpTrayIcon className="inline-block h-10 w-10 cursor-pointer p-2" />
                <ArrowDownTrayIcon className="inline-block h-10 w-10 cursor-pointer p-2" />
              </div>
            </div>
            <div className="h-[460px] overflow-scroll">
              {userPlayLists[playListId]?.next.map((item, i) => (
                <div className="py-0.5" key={i}>
                  <YoutubeVideoCard index={i} playListItem={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default YoutubeListItem;
