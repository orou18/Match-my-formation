"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, SkipBack, SkipForward, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
}

export default function VideoPlayer({
  videoUrl,
  thumbnail,
  title,
  autoPlay = false,
  controls = true,
  className = "",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffered, setBuffered] = useState(0);

  // Formater le temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gérer la lecture/pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Gérer le volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  // Gérer le mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.muted = false;
      setVolume(videoRef.current.volume);
    } else {
      videoRef.current.muted = true;
    }
    setIsMuted(!isMuted);
  };

  // Gérer le plein écran
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!isFullscreen) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Avancer/reculer
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
  };

  // Mettre à jour le temps
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  // Mettre à jour la durée
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Gérer le buffering
  const handleProgress = () => {
    if (!videoRef.current) return;
    const buffered = videoRef.current.buffered;
    if (buffered && buffered.length > 0) {
      const bufferedEnd = buffered.end(buffered.length - 1);
      setBuffered(bufferedEnd);
    }
  };

  // Gérer les erreurs
  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error("Erreur de lecture vidéo:", e);
    setIsPlaying(false);
  };

  // Détecter les URLs YouTube et convertir en embed
  const getVideoSrc = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtube.com') 
        ? url.split('v=')[1]?.split('&')[0]
        : url.split('/').pop();
      
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`;
    }
    
    if (url.includes('vimeo.com')) {
      const videoId = url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}?autoplay=${autoPlay ? 1 : 0}`;
    }
    
    return url;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'k':
          togglePlay();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowUp':
          handleVolumeChange({ target: { value: Math.min(1, volume + 0.1) } } as any);
          break;
        case 'ArrowDown':
          handleVolumeChange({ target: { value: Math.max(0, volume - 0.1) } } as any);
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
      }
    };

    video.addEventListener('keydown', handleKeyPress);
    return () => {
      video.removeEventListener('keydown', handleKeyPress);
    };
  }, [isPlaying, currentTime, duration, volume, isMuted, isFullscreen]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const hideControls = () => {
      setShowControls(false);
    };

    const showControls = () => {
      setShowControls(true);
    };

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(hideControls, 3000);
    };

    const video = videoRef.current;
    if (video && controls) {
      video.addEventListener('mousemove', handleMouseMove);
      video.addEventListener('mouseenter', showControls);
      video.addEventListener('mouseleave', hideControls);
    }

    return () => {
      if (video) {
        video.removeEventListener('mousemove', handleMouseMove);
        video.removeEventListener('mouseenter', showControls);
        video.removeEventListener('mouseleave', hideControls);
      }
      clearTimeout(timeout);
    };
  }, [controls]);

  const videoSrc = getVideoSrc(videoUrl);

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {/* Miniature de fond */}
      {!isPlaying && thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Vidéo */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="w-full h-full object-contain"
        autoPlay={autoPlay}
        controls={false}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onProgress={handleProgress}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Barre de progression */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Barre de buffering */}
        {buffered > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600">
            <div
              className="h-full bg-red-600 transition-all duration-300"
              style={{ width: `${(buffered / duration) * 100}%` }}
            />
          </div>
        )}

        {/* Contrôles personnalisés */}
        {controls && showControls && (
          <div className="flex items-center justify-between text-white">
            {/* Boutons de lecture */}
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => skip(-10)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Reculer de 10s"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={() => skip(10)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label="Avancer de 10s"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            {/* Temps et progression */}
            <div className="flex items-center space-x-3">
              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              {/* Barre de progression cliquable */}
              <div
                className="w-48 h-1 bg-gray-600 rounded-full cursor-pointer relative"
                onClick={(e) => {
                  if (!videoRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newTime = (clickX / rect.width) * duration;
                  videoRef.current.currentTime = newTime;
                }}
              >
                <div
                  className="h-full bg-red-600 rounded-full transition-all duration-300"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>

            {/* Volume et plein écran */}
            <div className="flex items-center space-x-2">
              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  aria-label={isMuted ? "Activer le son" : "Couper le son"}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(isMuted ? 0 : volume) * 100}%, #4b5563 ${(isMuted ? 0 : volume) * 100}%, #4b5563 100%)`
                  }}
                />
              </div>

              {/* Plein écran */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Titre */}
        {title && (
          <div className="absolute top-4 left-4 right-4 text-white text-sm bg-black/50 backdrop-blur-sm rounded p-2">
            {title}
          </div>
        )}
      </div>

      {/* Overlay de chargement */}
      {videoSrc.includes('youtube.com') && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-sm">
            Chargement de la vidéo YouTube...
          </div>
        </div>
      )}
    </div>
  );
}