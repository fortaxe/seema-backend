// Handle different YouTube URL formats
export const extractVideoId = (url: string): string | null => {
  let videoId = "";

  // Handle different YouTube URL formats
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1];
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1];
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("embed/")[1];
  } else if (url.includes("youtube.com/shorts/")) {
    // Handle YouTube Shorts URLs
    videoId = url.split("shorts/")[1];
  }

  // Remove additional parameters if present
  const ampersandPosition = videoId.indexOf("&");
  if (ampersandPosition !== -1) {
    videoId = videoId.substring(0, ampersandPosition);
  }

  // Validate videoId exists and meets YouTube ID format
  if (!videoId || videoId.length < 11) {
    return null;
  }

  return videoId;
};
