import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { loadPlayList, PlayListData } from "../apis/videoList";

import ReactPlayer from "react-player";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  playSelectedVideo,
  initPlayListQueues,
  selectCurrentPlays,
  selectPlayLists,
  setStartSeconds,
  shuffleNextQueue,
  backToPrevQueue,
} from "../features/playsSlice";
import { useEffect, useMemo, useState } from "react";
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
import { PlayListItem } from "../types/PlayLists";

import shuffleLogo from "../assets/shuffle.svg";

export async function loader({
  params,
}: LoaderFunctionArgs): Promise<{ playListData: PlayListData }> {
  const playListId = params.playListId; // params에서 playListId를 추출
  if (!playListId) {
    throw new Error("PlayList ID is required"); // playListId가 없을 때 처리
  }

  const playListData = await loadPlayList(playListId);
  return { playListData };
}

const YoutubeListItem = () => {
  const { keycloak, initialized } = useKeycloak();
  const { playListData } = useLoaderData() as { playListData: PlayListData };

  const { playListId } = useParams();

  const dispatch = useAppDispatch();
  const userPlayLists = useAppSelector(selectPlayLists);
  const userCurrentPlays = useAppSelector(selectCurrentPlays);
  if (!playListId) return null;

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    // _loadYoutubeLists();
  }, []);

  if (
    userCurrentPlays[playListId] === undefined ||
    userCurrentPlays[playListId] === null ||
    userCurrentPlays[playListId].item === null
  ) {
    dispatch(
      initPlayListQueues({
        playListId: playListId,
        playListData: playListData,
      })
    );
    dispatch(
      playSelectedVideo({
        playListId,
        selectedPlayListItem: userPlayLists[playListId]?.next[0],
      })
    );
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

  const _prevQueue = () => {
    dispatch(backToPrevQueue(playListId));
  };

  const _setPlaying = () => {
    setPlaying(!playing);
  };

  const _nextQueue = () => {
    dispatch(
      playSelectedVideo({
        playListId,
        selectedPlayListItem: userPlayLists[playListId]?.next[0],
      })
    );
  };

  const _onError = () => {
    console.error("Error on playing video");
    _nextQueue();
  };

  const _playSelectedVideo = (selectedPlayListItem: PlayListItem) => {
    dispatch(playSelectedVideo({ playListId, selectedPlayListItem }));
  };

  const _shuffleNextQueue = () => {
    dispatch(shuffleNextQueue(playListId));
  };

  if (
    userCurrentPlays &&
    userCurrentPlays[playListId] &&
    userPlayLists[playListId] &&
    userCurrentPlays[playListId].item
  )
    return (
      <main className="container">
        <div className="flex">
          <div className="w-[350px] h-[240px]">
            {
              <ReactPlayer
                width="350px"
                height="240px"
                playing={playing}
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
                onEnded={_nextQueue}
                onError={_onError}
                progressInterval={5000}
                stopOnUnmount={false}
                url={`https://www.youtube.com/watch?v=${userCurrentPlays[playListId]?.item?.resource.videoId}`}
              />
            }
          </div>
          <div className="flex flex-col justify-end h-[240px] overflow-y-scroll">
            {/* <ArrowTopRightOnSquareIcon className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200" /> */}
            <h2 className="line-clamp-2">
              {userCurrentPlays[playListId].item!.title}
            </h2>
            <h4>{userCurrentPlays[playListId].item!.videoOwnerChannelTitle}</h4>
            <div className="my-1 border-b border-transparent"></div>
            <div className="line-clamp-2">
              {userCurrentPlays[playListId].item!.description}
            </div>
            <div className="flex space-x-1">
              <ChevronDoubleLeftIcon
                className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                onClick={() => _prevQueue()}
              />
              <PlayPauseIcon
                className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                onClick={() => _setPlaying()}
              ></PlayPauseIcon>
              <ChevronDoubleRightIcon
                className="inline-block h-10 w-10 cursor-pointer p-2 hover:bg-slate-200"
                onClick={() => _nextQueue()}
              />
              <div className="grow"></div>
              <ArrowPathIcon className="inline-block h-10 w-10 cursor-pointer place-self-end p-2 hover:bg-slate-200" />
            </div>
          </div>
        </div>
        <div className="flex w-[1200px]">
          <div className="w-[360px] rounded-md border">
            <small>이전</small>
            <div className="p-2">
              <small className="text-gray-500">
                {userPlayLists[playListId]?.prev.length ?? 0} /{" "}
                {userCurrentPlays[playListId]?.contentDetails?.itemCount ?? 0}
              </small>
            </div>
            <div className="h-[460px] overflow-scroll">
              {userPlayLists[playListId]?.prev &&
                reversedPrevList.map((item, i) => (
                  <div className="py-0.5" key={i}>
                    <YoutubeVideoCard
                      index={i}
                      playListItem={item}
                      onClick={() => _playSelectedVideo(item)}
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="w-[400px] rounded-md border">
            <small>다음</small>
            <div className="p-2">
              <b>{userCurrentPlays[playListId].title} </b>
              <small className="text-gray-500">
                {userCurrentPlays[playListId].channelTitle} ·{" "}
                {userPlayLists[playListId]?.next.length ?? 0} /{" "}
                {userCurrentPlays[playListId]?.contentDetails?.itemCount ?? 0}
              </small>
              <div className="flex justify-between">
                <div className="inline-block">
                  <img
                    className="inline-block h-10 w-10 cursor-pointer p-2"
                    src={shuffleLogo}
                    onClick={() => _shuffleNextQueue()}
                  />
                </div>
                <ArrowUpTrayIcon className="inline-block h-10 w-10 cursor-pointer p-2" />
                <ArrowDownTrayIcon className="inline-block h-10 w-10 cursor-pointer p-2" />
              </div>
            </div>
            <div className="h-[460px] overflow-scroll">
              {userPlayLists[playListId]?.next.map((item, i) => (
                <div className="py-0.5" key={i}>
                  <YoutubeVideoCard
                    index={i}
                    playListItem={item}
                    onClick={() => _playSelectedVideo(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
};

export default YoutubeListItem;
