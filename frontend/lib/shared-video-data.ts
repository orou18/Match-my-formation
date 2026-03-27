import { VideoStore } from "@/lib/video-store";

export class SharedVideoData {
  static getAllVideos() {
    return VideoStore.getVideos();
  }

  static addVideo(video: any) {
    console.log("🎬 SharedVideoData - Ajout vidéo:", video.title);
    VideoStore.addVideo(video);
    console.log(
      "🎬 SharedVideoData - Total vidéos:",
      VideoStore.getVideos().length
    );
  }

  static getPublicVideos() {
    return VideoStore.getPublicVideos();
  }

  static getCreatorVideos(creatorId: number) {
    return VideoStore.getVideos().filter(
      (video) => video.creator_id === creatorId
    );
  }

  static updateVideo(id: string, updates: any) {
    VideoStore.updateVideo(id, updates);
  }

  static deleteVideo(id: string) {
    VideoStore.deleteVideo(id);
  }

  static getVideoById(id: string) {
    return VideoStore.getVideos().find((v) => v.id === id);
  }
}
