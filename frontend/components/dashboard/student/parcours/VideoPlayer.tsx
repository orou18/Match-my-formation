"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Maximize2, Heart, Bookmark, Share2, ThumbsUp, ThumbsDown } from "lucide-react";

interface VideoPlayerProps {
  video: {
    id: number;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
    progress: number;
    liked: boolean;
    favorite: boolean;
    isPremium: boolean;
    views: number;
    likes: number;
    instructor: {
      name: string;
      avatar: string;
    };
  };
  onProgressUpdate: (videoId: number, progress: number, position: number) => void;
  onLike: (videoId: number) => void;
  onFavorite: (videoId: number) => void;
}

export default function VideoPlayer({ 
  video, 
  onProgressUpdate, 
  onLike, 
  onFavorite 
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const video = videoRef.current;
      if (!video) return;

      const current = video.currentTime as number;
      const total = video.duration;
      
      if (!isNaN(total) && total > 0) {
        const progress = (current / total) * 100;
        setCurrentTime(current);
        setDuration(total);
        onProgressUpdate(Number(video.id), progress, current);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(Number(video.duration));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onProgressUpdate(Number(video.id), 100, Number(video.duration));
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [video.id]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    const progressBar = progressBarRef.current;
    if (!video || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const seekTime = (clickPercent / 100) * Number(video.duration);
    
    video.currentTime = seekTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    setPlaybackSpeed(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const progressPercent = duration > 0 ? (currentTime / Number(duration)) * 100 : 0;

  return (
    <div className="relative bg-black rounded-lg overflow-hidden group">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video"
        poster={video.thumbnail}
        onClick={togglePlay}
        onMouseMove={showControlsTemporarily}
        onMouseLeave={() => setShowControls(false)}
      >
        <source src={video.videoUrl} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {/* Overlay Controls */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
          {isPlaying ? (
            <Pause size={24} className="text-gray-900" />
          ) : (
            <Play size={24} className="text-gray-900 ml-1" />
          )}
        </div>
      </button>

      {/* Bottom Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-transform duration-300 ${
          showControls ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-3">
          <div 
            ref={progressBarRef}
            className="relative h-1 bg-gray-600 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-red-600 rounded-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
            <div 
              className="absolute left-0 top-0 h-full bg-red-500 rounded-full"
              style={{ width: `${Math.min(video.progress, progressPercent)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-white text-sm">
          {/* Left Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} className="ml-0.5" />
              )}
            </button>

            <span className="text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="flex items-center gap-1">
              <Volume2 size={16} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-red-600"
              />
            </div>

            <button
              onClick={changePlaybackSpeed}
              className="px-2 py-1 text-xs bg-white/20 rounded hover:bg-white/30 transition-colors"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onLike(video.id)}
              className={`p-1 rounded transition-colors ${
                video.liked 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-white hover:text-red-400'
              }`}
            >
              <ThumbsUp size={16} className={video.liked ? 'fill-current' : ''} />
            </button>

            <button
              onClick={() => onFavorite(video.id)}
              className={`p-1 rounded transition-colors ${
                video.favorite 
                  ? 'text-yellow-500 hover:text-yellow-600' 
                  : 'text-white hover:text-yellow-400'
              }`}
            >
              <Bookmark size={16} className={video.favorite ? 'fill-current' : ''} />
            </button>

            <button className="p-1 text-white hover:text-gray-300 transition-colors">
              <Share2 size={16} />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1 text-white hover:text-gray-300 transition-colors"
            >
              <Maximize2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Premium Badge */}
      {video.isPremium && (
        <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
          Premium
        </div>
      )}

      {/* Video Info Overlay */}
      <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg max-w-xs opacity-0 group-hover:opacity-100 transition-opacity">
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{video.title}</h3>
        <p className="text-xs opacity-80 line-clamp-3">{video.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
            <span className="text-xs text-white font-bold">
              {video.instructor.name.charAt(0)}
            </span>
          </div>
          <span className="text-xs">{video.instructor.name}</span>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs">
          <span>{video.views} vues</span>
          <span>{video.likes} likes</span>
          <span>{Math.round(video.progress)}% complété</span>
        </div>
      </div>
    </div>
  );
}
