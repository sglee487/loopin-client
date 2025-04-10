import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ReactTimeago from "react-timeago";
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectCurrentPlays } from "../features/playsSlice";

interface ComputedVideoList {
  playListId: string;
  startSeconds: number;
  thumbnail: string | undefined;
  title: string;
  channelTitle: string | undefined;
  publishedAt: string | undefined;
}

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

const VideoList = () => {
  const [youtubeLists, setYoutubeLists] = useState<any[]>([]);

  useEffect(() => {
    _loadYoutubeLists();
  }, []);

  const _loadYoutubeLists = async () => {
    const response = await axios.get(`${API_BASE_URL}/lists`);
    setYoutubeLists(response.data.content);
  };

  const userCurrentPlays = useAppSelector(selectCurrentPlays);

  const computedVideoLists = useMemo(() => {
    const result: ComputedVideoList[] = [];
    Object.entries(userCurrentPlays).forEach(([playListId, play]) => {
      result.push({
        playListId: playListId,
        startSeconds: play.startSeconds,
        thumbnail: play.item?.thumbnail,
        title: play.localized?.title,
        channelTitle: play.item?.channelTitle,
        publishedAt: play.item?.publishedAt,
      });
    });
    youtubeLists.forEach((youtubeList) => {
      if (!(youtubeList.playListId in userCurrentPlays)) {
        result.push({
          playListId: youtubeList.playListId,
          startSeconds: 0,
          thumbnail: youtubeList.thumbnail,
          title: youtubeList.title,
          channelTitle: youtubeList.channelTitle,
          publishedAt: youtubeList.publishedAt,
        });
      }
    });
    return result;
  }, [youtubeLists, userCurrentPlays]);

  return (
    <main className=".container-fluid flex flex-wrap">
      {computedVideoLists.map((computedVideoList) => {
        return (
          <Link
            to={`/playlist/${computedVideoList.playListId}`}
            key={computedVideoList.playListId}
            className="relative w-80 p-2"
          >
            <img
              className="h-[180px] w-[320px] rounded-xl object-fill"
              src={computedVideoList.thumbnail}
              alt={computedVideoList.title}
            />
            <div>
              <b>{computedVideoList.title}</b>
              <div>{computedVideoList.channelTitle}</div>
              <ReactTimeago date={computedVideoList.publishedAt || ""} />
            </div>
          </Link>
        );
      })}
      {/* {youtubeLists.map((youtubeList) => {
        return (
          <Link
            to={`/playlist/${youtubeList.playListId}`}
            key={youtubeList.playListId}
            className="relative w-80 p-2"
          >
            <img
              className="h-[180px] w-[320px] rounded-xl object-fill"
              src={youtubeList.thumbnail}
              alt={youtubeList.title}
            />
            <div>
              <b>{youtubeList.title}</b>
              <div>{youtubeList.channelTitle}</div>
              <ReactTimeago date={youtubeList.publishedAt} />
            </div>
          </Link>
        );
      })} */}
    </main>
  );
};

export default VideoList;
