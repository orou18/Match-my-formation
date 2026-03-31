import { fetchBackend } from "@/lib/api/backend-fetch";

export async function fetchPublicVideosPayload() {
  const response = await fetchBackend("/api/videos/public", {
    headers: {
      Accept: "application/json",
    },
  });

  const payload = await response.json().catch(() => ({}));
  const videos = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.videos)
      ? payload.videos
      : [];

  return {
    response,
    body: {
      videos,
      total: videos.length,
    },
  };
}
