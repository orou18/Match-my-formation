"use client";

import { motion } from "framer-motion";
import {
  Play,
  Clock,
  Eye,
  Heart,
  Star,
  Download,
  FileText,
  User,
  Calendar,
  Target,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import { useParams } from "next/navigation";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  locale?: string;
}

export default function VideoCard({ video, locale }: VideoCardProps) {
  // Vérification de sécurité pour éviter les erreurs si video est undefined
  if (!video) {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="aspect-video bg-gray-200 flex items-center justify-center">
          <p className="text-gray-500">Vidéo non disponible</p>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-2">Titre non disponible</h3>
          <p className="text-gray-600 text-sm">Description non disponible</p>
        </div>
      </div>
    );
  }

  const params = useParams();
  const currentLocale = locale || params.locale || "fr";

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="w-3 h-3" />;
      case "image":
        return <div className="w-3 h-3 bg-blue-500 rounded" />;
      case "video":
        return <Play className="w-3 h-3" />;
      case "audio":
        return <div className="w-3 h-3 bg-green-500 rounded-full" />;
      default:
        return <FileText className="w-3 h-3 text-gray-500" />;
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer"
    >
      {/* Lien vers la page d'aperçu */}
      <Link href={`/${currentLocale}/video/${video.id}`}>
        {/* Thumbnail avec overlay optimisé */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-lg group cursor-pointer">
          <SafeImage
            src={video.thumbnail || "/placeholder-video.jpg"}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />

          {/* Overlay au survol amélioré */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border-2 border-white/50"
            >
              <Play className="w-5 h-5 text-[#002B24] ml-0.5" />
            </motion.div>
          </div>

          {/* Badge de statut premium */}
          <div className="absolute top-2 left-2 z-10">
            {video.is_free ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-md"
              >
                <span>✨</span>
                Gratuit
              </motion.span>
            ) : (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md"
              >
                <span>💎</span>
                {video.price || 0}€
              </motion.span>
            )}
          </div>

          {/* Durée avec design amélioré */}
          <div className="absolute bottom-2 right-2 z-10">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-1 px-2 py-1 bg-black/80 backdrop-blur-sm text-white text-xs font-medium rounded-md border border-white/20"
            >
              <Clock className="w-3 h-3" />
              {video.duration || "00:00"}
            </motion.span>
          </div>

          {/* Badge de ressources amélioré */}
          {video.resources && video.resources.length > 0 && (
            <div className="absolute top-2 right-2 z-10">
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-md border border-blue-400/30"
              >
                <Download className="w-3 h-3" />
                {video.resources.length}
              </motion.span>
            </div>
          )}

          {/* Indicateur de qualité */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="px-1.5 py-0.5 bg-red-600 text-white text-xs font-bold rounded-full shadow-md"
            >
              HD
            </motion.span>
          </div>
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-4">
        {/* Titre */}
        <Link href={`/${currentLocale}/video/${video.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#002B24] transition-colors text-sm">
            {video.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.description || "Aucune description disponible"}
        </p>

        {/* Informations du créateur */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-xs text-gray-600">
              {video.creator?.name || "Anonyme"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {video.created_at}
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{(video.views || 0).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{(video.likes || 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{video.rating || 0}</span>
          </div>
        </div>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {video.tags.length > 2 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{video.tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Objectifs d'apprentissage */}
        {video.learning_objectives && video.learning_objectives.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
              <Target className="w-3 h-3" />
              Objectifs ({video.learning_objectives.length})
            </div>
            <div className="space-y-0.5">
              {video.learning_objectives.slice(0, 2).map((objective, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs text-gray-600"
                >
                  <div className="w-1 h-1 bg-green-500 rounded-full" />
                  <span className="line-clamp-1">{objective.title}</span>
                </div>
              ))}
              {video.learning_objectives.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{video.learning_objectives.length - 2} autres...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ressources */}
        {video.resources && video.resources.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1 text-xs font-medium text-gray-700 mb-1">
              <Download className="w-3 h-3" />
              Ressources ({video.resources.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {video.resources.slice(0, 3).map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded"
                >
                  {getFileIcon(resource.file_type || "document")}
                  <span className="max-w-20 truncate">
                    {resource.name || "Ressource"}
                  </span>
                </div>
              ))}
              {video.resources.length > 3 && (
                <div className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                  +{video.resources.length - 3}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <Play className="size-3" />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <Share2 className="w-3 h-3" />
            </button>
            <button className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
              <BookmarkPlus className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            <span>{video.duration}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
