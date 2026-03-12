"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { 
  Play, 
  Clock, 
  Eye, 
  Users, 
  Star, 
  Download, 
  FileText,
  CheckCircle,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
  Calendar,
  Award,
  BookOpen,
  Target,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Video, VideoResource, LearningObjective } from "@/types";

export default function VideoPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const videoId = params.id as string;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    setIsAuthenticated(!!token);

    // Simuler le chargement de la vidéo
    const timer = setTimeout(() => {
      setVideo(mockVideo);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [videoId]);

  const handleWatchVideo = () => {
    if (isAuthenticated) {
      // Rediriger vers la page de lecture
      router.push(`/${locale}/video/${videoId}/watch`);
    } else {
      // Rediriger vers la page de login
      router.push(`/${locale}/login?redirect=video/${videoId}`);
    }
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
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B24]"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vidéo non trouvée</h2>
          <Link href={`/${locale}/dashboard/student`} className="text-[#002B24] hover:underline">
            Retour au dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href={`/${locale}`} className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#002B24] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MM</span>
                </div>
                <span className="font-bold text-xl text-[#002B24]">MatchMy</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              {isAuthenticated ? (
                <Link href={`/${locale}/dashboard/student`} className="px-4 py-2 bg-[#002B24] text-white rounded-lg hover:bg-[#003d34]">
                  Dashboard
                </Link>
              ) : (
                <Link href={`/${locale}/login`} className="px-4 py-2 bg-[#002B24] text-white rounded-lg hover:bg-[#003d34]">
                  Se connecter
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec retour */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-600 hover:text-[#002B24] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vidéo thumbnail avec bouton play */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative rounded-2xl overflow-hidden bg-black aspect-video cursor-pointer group"
              onClick={handleWatchVideo}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              />
              
              {/* Bouton play central */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Play className="w-8 h-8 text-[#002B24] ml-1" />
                </motion.div>
              </div>

              {/* Badge de statut */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
                  {video.is_free ? 'Gratuit' : 'Premium'}
                </span>
              </div>

              {/* Durée */}
              <div className="absolute bottom-4 right-4">
                <span className="px-3 py-1 bg-black/70 text-white text-sm font-medium rounded-lg">
                  {video.duration}
                </span>
              </div>
            </motion.div>

            {/* Titre et description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{video.title}</h1>
              <p className="text-gray-600 leading-relaxed mb-6">{video.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {video.tags?.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Statistiques */}
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views.toLocaleString()} vues</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{video.likes.toLocaleString()} likes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Publié le {new Date(video.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </motion.div>

            {/* Objectifs d'apprentissage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-[#002B24]" />
                <h2 className="text-xl font-bold text-gray-900">Objectifs d'apprentissage</h2>
              </div>
              
              <div className="space-y-3">
                {video.learning_objectives?.map((objective, index) => (
                  <div key={objective.id} className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-[#002B24]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-[#002B24] text-xs font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{objective.title}</h3>
                      <p className="text-sm text-gray-600">{objective.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ressources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-5 h-5 text-[#002B24]" />
                <h2 className="text-xl font-bold text-gray-900">Ressources téléchargeables</h2>
              </div>
              
              <div className="space-y-3">
                {video.resources?.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(resource.file_type)}
                      <div>
                        <h3 className="font-medium text-gray-900">{resource.name}</h3>
                        <p className="text-sm text-gray-500">{resource.description}</p>
                        <p className="text-xs text-gray-400">{formatFileSize(resource.file_size)}</p>
                      </div>
                    </div>
                    <button className="p-2 bg-[#002B24] text-white rounded-lg hover:bg-[#003d34] transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Bouton d'action principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-[#002B24] to-[#004D40] rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isAuthenticated ? 'Commencer la lecture' : 'Connectez-vous pour regarder'}
                  </h3>
                  <p className="text-white/80">
                    {isAuthenticated 
                      ? 'Accédez à la vidéo complète et aux ressources associées'
                      : 'Créez un compte gratuit pour accéder à ce contenu'
                    }
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleWatchVideo}
                  className="px-6 py-3 bg-white text-[#002B24] rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>{isAuthenticated ? 'Regarder' : 'Se connecter'}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Infos créateur */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Votre formateur</h3>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  {video.creator?.avatar ? (
                    <Image src={video.creator.avatar} alt={video.creator.name} fill className="rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">
                      {video.creator?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{video.creator?.name}</h4>
                  <p className="text-sm text-gray-600">{video.creator?.specialty}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Note moyenne</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">4.8</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Étudiants</span>
                  <span className="font-medium">2,450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Formations</span>
                  <span className="font-medium">12</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Voir le profil
              </button>
            </motion.div>

            {/* Certification */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200"
            >
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-yellow-600" />
                <h3 className="text-lg font-bold text-gray-900">Certification</h3>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Recevez un certificat de completion après avoir terminé cette formation
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Reconnu dans l'industrie</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Partageable sur LinkedIn</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Code de vérification unique</span>
                </div>
              </div>
            </motion.div>

            {/* Vidéos similaires */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Formations similaires</h3>
              
              <div className="space-y-4">
                <div className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="w-20 h-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">Gestion Hôtelière Avancée</h4>
                    <p className="text-xs text-gray-500">Dr. Sophie Martin</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>4.9</span>
                      <span>•</span>
                      <span>18:22</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="w-20 h-14 bg-gray-200 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 text-sm truncate">Marketing Digital Touristique</h4>
                    <p className="text-xs text-gray-500">Julie Bernard</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>4.7</span>
                      <span>•</span>
                      <span>15:45</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
