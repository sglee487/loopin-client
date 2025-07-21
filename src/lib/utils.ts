/**
 * 초를 시:분:초 형식으로 변환
 */
export const formatDuration = (seconds: number): string => {
  if (seconds == null || isNaN(seconds)) {
    return "0:00";
  }

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const paddedMins = mins.toString().padStart(2, "0");
  const paddedSecs = secs.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }

  return `${mins}:${paddedSecs}`;
};

/**
 * 날짜를 한국어 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}; 