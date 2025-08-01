import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";
import {
  useGetSessionsQuery,
  useGetSessionQuery,
} from "@/features/player/api/playSessionApi";
import {
  loadSession,
  pauseVideo,
  setCurrentPlaylistId,
} from "@/features/player/playerSlice";
import type { VideoItem } from "@/features/player/types";

/**
 * Invisible helper component that, once the user logs in, automatically
 * fetches all play sessions and prepares the most recently updated session
 * for playback (without auto-playing). This mimics the behaviour of a
 * "Continue listening" shortcut, ensuring the player bar is ready to resume
 * listening immediately after login.
 */
export default function LastSessionLoader() {
  const dispatch = useDispatch();

  /* ------------------------------------------------------------------ */
  /* 1. Fetch current user                                              */
  /* ------------------------------------------------------------------ */
  const { data: currentUser, isLoading: userLoading } =
    useGetCurrentUserQuery();

  /* ------------------------------------------------------------------ */
  /* 2. Fetch list of sessions once user information is available       */
  /* ------------------------------------------------------------------ */
  const { data: sessions = [], isLoading: sessionsLoading } =
    useGetSessionsQuery(undefined, {
      skip: userLoading || !currentUser,
    });

  /* ------------------------------------------------------------------ */
  /* 3. Determine session with latest updatedAt                         */
  /* ------------------------------------------------------------------ */
  const latestSession = (sessions ?? []).reduce<
    import("@/features/player/api/playSessionApi").PlaySession | undefined
  >((latest, cur) => {
    if (!latest) return cur;
    const latestTime = latest.updatedAt
      ? new Date(latest.updatedAt).getTime()
      : 0;
    const curTime = cur.updatedAt ? new Date(cur.updatedAt).getTime() : 0;
    return curTime > latestTime ? cur : latest;
  }, undefined);

  const playlistId = latestSession?.playlist?.id ?? 0;

  /* ------------------------------------------------------------------ */
  /* 4. Fetch detailed session info for the latest playlist             */
  /* ------------------------------------------------------------------ */
  const { data: detailedSession, isLoading: detailLoading } =
    useGetSessionQuery(playlistId, {
      skip: !playlistId,
    });

  /* ------------------------------------------------------------------ */
  /* 5. Dispatch to player store once, when all data is ready           */
  /* ------------------------------------------------------------------ */
  const hasLoadedRef = useRef(false);
  const currentVideo = useSelector(
    (state: RootState) => state.player.currentVideo
  );

  useEffect(() => {
    if (hasLoadedRef.current) return; // already executed

    // Preconditions: user logged in & data loaded
    if (!currentUser || userLoading) return;
    if (sessionsLoading || detailLoading) return;
    if (!latestSession || !detailedSession) return;

    // If player already has a video, we respect that and skip auto-loading
    if (currentVideo) return;

    if (!detailedSession.nowPlaying) return;

    // Helper: convert backend MediaItem -> frontend VideoItem
    const toVideoItem = (
      mi: import("@/features/playlists/types").MediaItem
    ): VideoItem => ({
      id: mi.id,
      title: mi.title,
      thumbnail: mi.thumbnail,
      channelTitle: mi.videoOwnerChannelTitle ?? "",
      publishedAt: mi.publishedAt,
      durationSeconds: mi.durationSeconds,
      resourceId: mi.resourceId,
    });

    const currentVid = toVideoItem(detailedSession.nowPlaying);
    const prevArr = (detailedSession.prevItems ?? []).map(toVideoItem);
    const nextArr = (detailedSession.nextItems ?? []).map(toVideoItem);

    // Load session into the player store and pause immediately so that
    // the user can decide when to resume.
    dispatch(
      loadSession({
        current: currentVid,
        prevItems: prevArr,
        nextItems: nextArr,
        startSeconds: detailedSession.startSeconds,
        playlistId,
      })
    );
    dispatch(pauseVideo());
    dispatch(setCurrentPlaylistId(playlistId));

    hasLoadedRef.current = true;
  }, [
    currentUser,
    userLoading,
    sessionsLoading,
    detailLoading,
    latestSession,
    detailedSession,
    currentVideo,
    playlistId,
    dispatch,
  ]);

  return null;
}
