import { PlayListItem } from "../types/PlayLists";

interface YoutubeVideoCardProps {
  index: number;
  playListItem: PlayListItem;
}

const YoutubeVideoCard = ({ index, playListItem }: YoutubeVideoCardProps) => {
  return (
    <div className="flex cursor-pointer hover:bg-slate-200">
      <div className="w-8 flex-none self-center text-center text-sm">
        {index}
      </div>
      <img
        className="h-[56.25px] w-[100px] flex-none p-0.5"
        src={playListItem.thumbnail}
        alt={playListItem.title}
      />
      <div className="flex shrink flex-col">
        <p className="line-clamp-2">{playListItem.title}</p>
        <p className="text-xs text-gray-500">
          {playListItem.videoOwnerChannelTitle}
        </p>
      </div>
    </div>
  );
};

export default YoutubeVideoCard;
