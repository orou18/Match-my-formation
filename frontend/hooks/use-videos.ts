import { useState, useEffect, useCallback } from "react";
import {
  videosService,
  Video,
  VideoFormData,
} from "@/lib/services/videos-service";

export interface UseVideosOptions {
  page?: number;
  perPage?: number;
  filters?: {
    category?: string;
    creator_id?: number;
    is_published?: boolean;
  };
  autoFetch?: boolean;
}

export function useVideos(options: UseVideosOptions = {}) {
  const { page = 1, perPage = 12, filters, autoFetch = true } = options;

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage,
    total: 0,
  });

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await videosService.getVideos(page, perPage, filters);
      setVideos(response.data);
      setPagination({
        currentPage: response.meta.current_page,
        lastPage: response.meta.last_page,
        perPage: response.meta.per_page,
        total: response.meta.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch videos");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [page, perPage, filters]);

  useEffect(() => {
    if (autoFetch) {
      fetchVideos();
    }
  }, [fetchVideos, autoFetch]);

  const createVideo = useCallback(async (videoData: VideoFormData) => {
    setLoading(true);
    setError(null);

    try {
      const newVideo = await videosService.createVideo(videoData);
      setVideos((prev) => [newVideo, ...prev]);
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));
      return newVideo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVideo = useCallback(
    async (id: number, videoData: Partial<VideoFormData>) => {
      setLoading(true);
      setError(null);

      try {
        const updatedVideo = await videosService.updateVideo(id, videoData);
        setVideos((prev) =>
          prev.map((video) => (video.id === id ? updatedVideo : video))
        );
        return updatedVideo;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update video");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteVideo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await videosService.deleteVideo(id);
      setVideos((prev) => prev.filter((video) => video.id !== id));
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePublish = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const updatedVideo = await videosService.toggleVideoPublishStatus(id);
      setVideos((prev) =>
        prev.map((video) => (video.id === id ? updatedVideo : video))
      );
      return updatedVideo;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to toggle publish status"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likeVideo = useCallback(async (id: number) => {
    try {
      const result = await videosService.likeVideo(id);
      setVideos((prev) =>
        prev.map((video) =>
          video.id === id ? { ...video, likes: result.likes } : video
        )
      );
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to like video");
      throw err;
    }
  }, []);

  const unlikeVideo = useCallback(async (id: number) => {
    try {
      const result = await videosService.unlikeVideo(id);
      setVideos((prev) =>
        prev.map((video) =>
          video.id === id ? { ...video, likes: result.likes } : video
        )
      );
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlike video");
      throw err;
    }
  }, []);

  const searchVideos = useCallback(
    async (
      query: string,
      searchFilters?: {
        category?: string;
        creator?: string;
        tags?: string[];
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await videosService.searchVideos(query, searchFilters);
        setVideos(response.data);
        setPagination({
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          perPage: response.meta.per_page,
          total: response.meta.total,
        });
        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to search videos"
        );
        setVideos([]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(() => {
    return fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    loading,
    error,
    pagination,
    fetchVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    togglePublish,
    likeVideo,
    unlikeVideo,
    searchVideos,
    refresh,
  };
}

export function useCreatorVideos(creatorId?: number) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreatorVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const creatorVideos = await videosService.getCreatorVideos(creatorId);
      setVideos(creatorVideos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch creator videos"
      );
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [creatorId]);

  useEffect(() => {
    fetchCreatorVideos();
  }, [fetchCreatorVideos]);

  const createVideo = useCallback(async (videoData: VideoFormData) => {
    setLoading(true);
    setError(null);

    try {
      const newVideo = await videosService.createVideo(videoData);
      setVideos((prev) => [newVideo, ...prev]);
      return newVideo;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVideo = useCallback(
    async (id: number, videoData: Partial<VideoFormData>) => {
      setLoading(true);
      setError(null);

      try {
        const updatedVideo = await videosService.updateVideo(id, videoData);
        setVideos((prev) =>
          prev.map((video) => (video.id === id ? updatedVideo : video))
        );
        return updatedVideo;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update video");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteVideo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await videosService.deleteVideo(id);
      setVideos((prev) => prev.filter((video) => video.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    videos,
    loading,
    error,
    fetchCreatorVideos,
    createVideo,
    updateVideo,
    deleteVideo,
    refresh: fetchCreatorVideos,
  };
}

export function usePublicVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicVideos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const publicVideos = await videosService.getPublicVideos();
      setVideos(publicVideos);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch public videos"
      );
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicVideos();
  }, [fetchPublicVideos]);

  return {
    videos,
    loading,
    error,
    refresh: fetchPublicVideos,
  };
}
