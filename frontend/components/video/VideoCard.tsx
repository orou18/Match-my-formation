"use client";

import { motion } from "framer-motion";
import { Play, Clock, Eye, Heart, Star, Download, FileText, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import type { Video } from "@/types";

interface VideoCardProps {
  video: Video;
  locale?: string;
}

export default function VideoCard({ video, locale }: VideoCardProps) {
  const params = useParams();
  const currentLocale = locale || params.locale || "fr";

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4 text-red-500" />;
    if (fileType.includes('sheet')) return <FileText className="w-4 h-4 text-green-500" />;
    if (fileType.includes('word')) return <FileText className="w-4 h-4 text-blue-500" />;
    return <FileText className="w-4 h-4 text-gray-500" />;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group cursor-pointer"
    >
      {/* Lien vers la page d'aperçu */}
      <Link href={`/${currentLocale}/video/${video.id}`}>
        {/* Thumbnail avec overlay */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay au survol */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
            >
              <Play className="w-6 h-6 text-[#002B24] ml-0.5" />
            </motion.div>
          </div>

          {/* Badge de statut */}
          <div className="absolute top-3 left-3">
            {video.is_free ? (
              <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                Gratuit
              </span>
            ) : (
              <span className="px-2 py-1 bg-purple-500 text-white text-xs font-medium rounded-full">
                {video.price}€
              </span>
            )}
          </div>

          {/* Durée */}
          <div className="absolute bottom-3 right-3">
            <span className="px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
              <Clock className="w-3 h-3 inline mr-1" />
              {video.duration}
            </span>
          </div>

          {/* Badge de ressources */}
          {video.resources && video.resources.length > 0 && (
            <div className="absolute top-3 right-3">
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center">
                <Download className="w-3 h-3 mr-1" />
                {video.resources.length}
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Contenu */}
      <div className="p-5">
        {/* Titre */}
        <Link href={`/${currentLocale}/video/${video.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#002B24] transition-colors">
            {video.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {video.description}
        </p>

        {/* Infos créateur */}
        {video.creator && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
              {video.creator.avatar ? (
                <Image src={video.creator.avatar} alt={video.creator.name} fill className="rounded-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-gray-600">
                  {video.creator.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{video.creator.name}</p>
              <p className="text-xs text-gray-500 truncate">{video.creator.specialty}</p>
            </div>
          </div>
        )}

        {/* Objectifs d'apprentissage */}
        {video.learning_objectives && video.learning_objectives.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">
              {video.learning_objectives.length} objectif{video.learning_objectives.length > 1 ? 's' : ''} d'apprentissage
            </p>
            <div className="flex flex-wrap gap-1">
              {video.learning_objectives.slice(0, 2).map((objective, index) => (
                <span key={objective.id} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                  {index + 1}. {objective.title.length > 20 ? objective.title.substring(0, 20) + '...' : objective.title}
                </span>
              ))}
              {video.learning_objectives.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{video.learning_objectives.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Ressources */}
        {video.resources && video.resources.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Ressources disponibles</p>
            <div className="flex flex-wrap gap-1">
              {video.resources.slice(0, 2).map((resource) => (
                <div key={resource.id} className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-full">
                  {getFileIcon(resource.file_type)}
                  <span className="text-xs text-gray-600 truncate max-w-20">
                    {resource.name.length > 15 ? resource.name.substring(0, 15) + '...' : resource.name}
                  </span>
                </div>
              ))}
              {video.resources.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{video.resources.length - 2}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                #{tag}
              </span>
            ))}
            {video.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{video.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Statistiques */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{video.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-3 h-3" />
              <span>{video.likes.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-3 h-3 text-yellow-500 fill-current" />
            <span>4.8</span>
          </div>
        </div>

        {/* Bouton d'action */}
        <div className="mt-4">
          <Link href={`/${currentLocale}/video/${video.id}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-[#002B24] text-white text-sm font-medium rounded-xl hover:bg-[#003d34] transition-colors flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Voir l'aperçu</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}