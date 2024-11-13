import { useEffect, useState } from "react";
import axios from "axios";
import ReactTimeago from "react-timeago";
import { Link } from "react-router-dom";

const VideoList = () => {
  const [youtubeLists, setYoutubeLists] = useState<any[]>([]);

  useEffect(() => {
    _loadYoutubeLists();
  }, []);

  const _loadYoutubeLists = async () => {
    const response = await axios.get("http://localhost:8080/api/v1/lists");
    setYoutubeLists(response.data.content);
    console.log(response.data.content);
    console.log(youtubeLists);
  };

  return (
    <main className=".container-fluid flex flex-wrap">
      {youtubeLists.map((youtubeList) => {
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
      })}
    </main>
  );
};

export default VideoList;
