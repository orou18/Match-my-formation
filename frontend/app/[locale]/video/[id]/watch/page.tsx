"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Settings, 
  Download, 
  FileText,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
  Clock,
  Eye,
  Users,
  Star,
  CheckCircle,
  BookOpen,
  Target,
  ChevronRight,
  SkipBack,
  SkipForward,
  Repeat,
  PictureInPicture
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Video, VideoResource, LearningObjective } from "@/types";

export default function VideoWatchPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const videoId = params.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [completedObjectives, setCompletedObjectives] = useState<Set<number>>(new Set());

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Données mockées pour la vidéo
  const mockVideo: Video = {
    id: parseInt(videoId),
    title: "Introduction au Tourisme Durable",
    description: "Découvrez les fondamentaux du tourisme écologique et les pratiques durables qui transforment l'industrie. Cette formation complète vous donnera les clés pour comprendre et mettre en œuvre des stratégies de tourisme responsable.",
    thumbnail: "/videos/video1-thumb.jpg",
    video_url: "/videos/video1.mp4",
    duration: "12:34",
    order: 1,
    creator_id: 1,
    views: 15420,
    likes: 892,
    comments: [],
    tags: ["tourisme", "durable", "ecologie", "environnement"],
    is_published: true,
    visibility: "public" as const,
    created_at: "2024-01-15",
    updated_at: "2024-01-15",
    creator: {
      id: 1,
      name: "Dr. Marie Laurent",
      email: "marie.laurent@example.com",
      avatar: "/avatars/creator1.jpg",
      specialty: "Tourisme Durable & Environnement"
    },
    learning_objectives: [
      {
        id: 1,
        video_id: parseInt(videoId),
        title: "Comprendre les principes du tourisme durable",
        description: "Maîtriser les concepts fondamentaux et les 3 piliers du développement durable appliqués au tourisme",
        order: 1
      },
      {
        id: 2,
        video_id: parseInt(videoId),
        title: "Analyser l'impact environnemental",
        description: "Évaluer et mesurer l'empreinte écologique des activités touristiques",
        order: 2
      },
      {
        id: 3,
        video_id: parseInt(videoId),
        title: "Mettre en œuvre des pratiques éco-responsables",
        description: "Appliquer concrètement des solutions durables dans le secteur touristique",
        order: 3
      }
    ],
    resources: [
      {
        id: 1,
        video_id: parseInt(videoId),
        name: "Guide pratique du tourisme durable",
        file_path: "/resources/guide-tourisme-durable.pdf",
        file_size: 2048000,
        file_type: "application/pdf",
        description: "Un guide complet avec les meilleures pratiques et check-lists",
        created_at: "2024-01-15"
      },
      {
        id: 2,
        video_id: parseInt(videoId),
        name: "Template d'audit environnemental",
        file_path: "/resources/audit-environnemental.xlsx",
        file_size: 512000,
        file_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        description: "Feuille de calcul pour évaluer l'impact de vos activités",
        created_at: "2024-01-15"
      },
      {
        id: 3,
        video_id: parseInt(videoId),
        name: "Études de cas - Hôtellerie verte",
        file_path: "/resources/etudes-cas-hotellerie.pdf",
        file_size: 3072000,
        file_type: "application/pdf",
        description: "5 exemples concrets d'hôtels ayant réussi leur transition écologique",
        created_at: "2024-01-15"
      }
    ],
    is_free: true
  };

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token");
    if (!token) {
      router.push(`/${locale}/login?redirect=video/${videoId}/watch`);
      return;
    }

    // Simuler le chargement de la vidéo
    const timer = setTimeout(() => {
      setVideo(mockVideo);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [videoId, locale, router]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('mousemove', handleMouseMove);
      return () => {
        video.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      };
    }
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleObjective = (objectiveId: number) => {
    const newCompleted = new Set(completedObjectives);
    if (newCompleted.has(objectiveId)) {
      newCompleted.delete(objectiveId);
    } else {
      newCompleted.add(objectiveId);
    }
    setCompletedObjectives(newCompleted);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    if (fileType.includes('sheet')) return <FileText className="w-5 h-5 text-green-500" />;
    if (fileType.includes('word')) return <FileText className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-gray-500" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Vidéo non trouvée</h2>
          <Link href={`/${locale}/dashboard/student`} className="text-white hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/70 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/${locale}/video/${videoId}`} className="flex items-center space-x-2 text-white hover:text-gray-300">
                <ArrowLeft className="w-5 h-5" />
                <span>Retour à l'aperçu</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-white/10 text-white">
                <Share2 className="w-5 h-5" />
              </button>
              <Link href={`/${locale}/dashboard/student`} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Lecteur vidéo */}
      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          className="w-full h-full"
          poster={video.thumbnail}
          onClick={togglePlay}
        >
          <source src={video.video_url} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>

        {/* Contrôles vidéo */}
        <motion.div
          animate={{ opacity: showControls ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50 flex items-end"
        >
          <div className="w-full p-4">
            {/* Barre de progression */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Contrôles principaux */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Boutons de lecture */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-white hover:bg-white/10 rounded">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    onClick={togglePlay}
                    className="p-3 bg-white text-black rounded-full hover:bg-gray-200"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                  </button>
                  <button className="p-2 text-white hover:bg-white/10 rounded">
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Volume */}
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-white" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Durée */}
                <span className="text-white text-sm">{video.duration}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button className="p-2 text-white hover:bg-white/10 rounded">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded">
                  <PictureInPicture className="w-4 h-4" />
                </button>
                <button className="p-2 text-white hover:bg-white/10 rounded">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contenu principal */}
      <div className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Titre et description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
                <p className="text-gray-300 leading-relaxed mb-6">{video.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {video.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Statistiques */}
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{video.views.toLocaleString()} vues</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{video.likes.toLocaleString()} likes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>Publié le {new Date(video.created_at).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </motion.div>

              {/* Objectifs d'apprentissage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-white" />
                    <h2 className="text-xl font-bold text-white">Objectifs d'apprentissage</h2>
                  </div>
                  <span className="text-sm text-gray-400">
                    {completedObjectives.size}/{video.learning_objectives?.length} complétés
                  </span>
                </div>
                
                <div className="space-y-3">
                  {video.learning_objectives?.map((objective, index) => (
                    <div 
                      key={objective.id} 
                      className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={() => toggleObjective(objective.id)}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        completedObjectives.has(objective.id) 
                          ? 'bg-green-500' 
                          : 'bg-gray-600'
                      }`}>
                        {completedObjectives.has(objective.id) ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-xs font-bold">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${
                          completedObjectives.has(objective.id) 
                            ? 'text-green-400 line-through' 
                            : 'text-white'
                        }`}>
                          {objective.title}
                        </h3>
                        <p className="text-sm text-gray-400">{objective.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {completedObjectives.size === video.learning_objectives?.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-center"
                  >
                    <p className="text-green-400 font-medium">🎉 Félicitations ! Vous avez complété tous les objectifs</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Ressources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-white" />
                  <h2 className="text-xl font-bold text-white">Ressources téléchargeables</h2>
                </div>
                
                <div className="space-y-3">
                  {video.resources?.map((resource) => (
                    <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(resource.file_type)}
                        <div>
                          <h3 className="font-medium text-white">{resource.name}</h3>
                          <p className="text-sm text-gray-400">{resource.description}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(resource.file_size)}</p>
                        </div>
                      </div>
                      <button className="p-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Infos créateur */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Votre formateur</h3>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                    {video.creator?.avatar ? (
                      <Image src={video.creator.avatar} alt={video.creator.name} fill className="rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-bold text-gray-400">
                        {video.creator?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{video.creator?.name}</h4>
                    <p className="text-sm text-gray-400">{video.creator?.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Note moyenne</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-white">4.8</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Étudiants</span>
                    <span className="font-medium text-white">2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Formations</span>
                    <span className="font-medium text-white">12</span>
                  </div>
                </div>

                <button className="w-full mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
                  Voir le profil
                </button>
              </motion.div>

              {/* Progression */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl p-6 border border-blue-500/30"
              >
                <h3 className="text-lg font-bold text-white mb-4">Votre progression</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Objectifs complétés</span>
                      <span className="text-white font-medium">
                        {Math.round((completedObjectives.size / (video.learning_objectives?.length || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(completedObjectives.size / (video.learning_objectives?.length || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Temps de visionnage</span>
                      <span className="text-white font-medium">
                        {Math.round((currentTime / duration) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {completedObjectives.size === video.learning_objectives?.length && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-center"
                  >
                    <p className="text-green-400 text-sm font-medium">🏆 Formation complétée !</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Actions rapides */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-white mb-4">Actions rapides</h3>
                
                <div className="space-y-3">
                  <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Aimer cette vidéo</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Laisser un commentaire</span>
                  </button>
                  <button className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
