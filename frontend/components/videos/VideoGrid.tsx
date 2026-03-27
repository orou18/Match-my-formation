"use client";

import { motion } from "framer-motion";
import { Play, Eye, ThumbsUp, Clock, User, Calendar } from "lucide-react";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  creator: string;
  creatorAvatar?: string;
  publishedAt: string;
  category?: string;
}

interface VideoGridProps {
  videos: Video[];
  variant?: "default" | "compact" | "featured";
  showCreator?: boolean;
  maxVideos?: number;
}

export default function VideoGrid({
  videos,
  variant = "default",
  showCreator = true,
  maxVideos,
}: VideoGridProps) {
  const displayVideos = maxVideos ? videos.slice(0, maxVideos) : videos;

  const getVideoCard = (video: Video, index: number) => {
    if (variant === "compact") {
      return (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{
            y: -5,
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 5px -5px rgba(0, 0, 0, 0.04)",
          }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden group cursor-pointer"
        >
          <div className="flex gap-4 p-4">
            {/* Thumbnail */}
            <div className="relative w-32 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              {/* Duration Badge */}
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {video.duration}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                {video.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{video.likes}</span>
                </div>
              </div>
              {showCreator && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <User className="w-3 h-3" />
                  <span>{video.creator}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      );
    }

    if (variant === "featured") {
      return (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{
            y: -8,
            scale: 1.02,
            boxShadow:
              "0 25px 50px -12px rgba(0, 122, 122, 0.15), 0 12px 12px -6px rgba(0, 122, 122, 0.08)",
          }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden group cursor-pointer border border-gray-100"
        >
          {/* Featured Badge */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Play className="w-3 h-3" />
              POPULAIRE
            </div>
          </div>

          {/* Thumbnail Container */}
          <div className="relative h-48 bg-gray-200">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-12 h-12 text-white" />
            </div>

            {/* Duration Badge */}
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {video.duration}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 line-clamp-3">
                  {video.description}
                </p>
              </div>

              {/* Category Badge */}
              {video.category && (
                <div className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                  {video.category}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{video.likes}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{video.publishedAt}</span>
              </div>
            </div>

            {/* Creator */}
            {showCreator && (
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div>
                  <div className="font-medium text-gray-900">
                    {video.creator}
                  </div>
                  <div className="text-xs text-gray-500">Créateur</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    // Default variant
    return (
      <motion.div
        key={video.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -5,
          boxShadow:
            "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 5px 5px -5px rgba(0, 0, 0, 0.04)",
        }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative h-48 bg-gray-200">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />

          {/* Duration Badge */}
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {video.duration}
          </div>

          {/* Play Overlay */}
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Play className="w-12 h-12 text-white transform translate-x-1" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {video.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{video.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{video.likes}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{video.publishedAt}</span>
            </div>
          </div>

          {/* Creator */}
          {showCreator && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-8 h-8 bg-gray-200 rounded-full" />
              <div>
                <div className="font-medium text-gray-900">{video.creator}</div>
                <div className="text-xs text-gray-500">Créateur</div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className={`grid gap-4 sm:gap-6 ${
        variant === "compact"
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          : variant === "featured"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      }`}
    >
      {displayVideos.map((video, index) => getVideoCard(video, index))}
    </div>
  );
}
