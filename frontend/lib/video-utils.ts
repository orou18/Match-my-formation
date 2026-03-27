export function isYouTubeUrl(url?: string | null) {
  if (!url) return false;
  return /youtube\.com|youtu\.be/.test(url);
}

export function toYouTubeEmbedUrl(url?: string | null) {
  if (!url) return null;

  const shortMatch = url.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const longMatch = url.match(/[?&]v=([^?&/]+)/);
  if (longMatch) {
    return `https://www.youtube.com/embed/${longMatch[1]}`;
  }

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) {
    return `https://www.youtube.com/embed/${embedMatch[1]}`;
  }

  return null;
}
