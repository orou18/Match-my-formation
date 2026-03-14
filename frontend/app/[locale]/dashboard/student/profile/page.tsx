"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
  Rocket,
  Crown,
  Camera,
  Edit2,
  Save,
  X,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Target,
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const locale = params.locale || "fr";

  useEffect(() => {
    // Utiliser les données de test pour éviter les erreurs
    const mockUser = {
      id: 3,
      name: "Alice Élève",
      email: "student@match.com",
      phone: "+33 6 12 34 56 78",
      location: "Paris, France",
      bio: "Passionnée par l'apprentissage en ligne et le développement durable.",
      website: "https://alice-portfolio.com",
      role: "student",
      specialty: "Tourisme et Environnement",
      education: "Master en Tourisme Durable",
      experience: "2 ans",
      avatar: null,
      joinedAt: "2024-01-15",
    };
    
    setUser(mockUser);
    setEditForm(mockUser);
    setLoading(false);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(user);
  };

  const handleSave = async () => {
    try {
      // Simuler l'API call
      setUser(editForm);
      setIsEditing(false);
      
      // Afficher un message de succès
      alert("Profil mis à jour avec succès !");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(user);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setEditForm((prev: any) => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFB]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B24]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Header responsive */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#002B24]">Mon profil</h1>
              <p className="text-gray-600 text-sm sm:text-base">Gérez vos informations personnelles et votre progression</p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-[#002B24] text-white rounded-lg hover:bg-[#003d34] transition-colors text-sm sm:text-base"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Modifier</span>
                  <span className="sm:hidden">Éditer</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline">Sauvegarder</span>
                    <span className="sm:hidden">Sauver</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Annuler</span>
                    <span className="sm:hidden">Annuler</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Profile Card - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
              {/* Avatar Section - Responsive */}
              <div className="flex flex-col items-center lg:items-start space-y-4">
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#002B24] to-[#004D40] rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold shadow-lg overflow-hidden">
                    {avatarPreview || editForm.avatar ? (
                      <img 
                        src={avatarPreview || editForm.avatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.name?.charAt(0)?.toUpperCase()
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[#002B24] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#003d34] transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                
                <div className="text-center lg:text-left">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-xl sm:text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-[#002B24] focus:outline-none text-center lg:text-left"
                    />
                  ) : (
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user?.name}</h2>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="text-gray-600 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] text-center lg:text-left mt-1"
                    />
                  ) : (
                    <p className="text-gray-600">{user?.email}</p>
                  )}
                </div>
              </div>

              {/* Info Section - Responsive Grid */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Téléphone</p>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900 truncate">{user?.phone || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Localisation</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location || ''}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900 truncate">{user?.location || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>

                  {/* Website */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Site web</p>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.website || ''}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900 truncate">{user?.website || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Spécialité</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.specialty || ''}
                          onChange={(e) => handleInputChange('specialty', e.target.value)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900 truncate">{user?.specialty || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>

                  {/* Education */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Formation</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.education || ''}
                          onChange={(e) => handleInputChange('education', e.target.value)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900 truncate">{user?.education || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-gray-600">Expérience</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.experience || ''}
                          onChange={(e) => handleInputChange('experience', e.target.value)}
                          className="font-semibold text-gray-900 bg-transparent border-b border-gray-400 focus:outline-none focus:border-[#002B24] w-full"
                        />
                      ) : (
                        <p className="font-semibold text-gray-900 truncate">{user?.experience || 'Non renseigné'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bio</h3>
                  {isEditing ? (
                    <textarea
                      value={editForm.bio || ''}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002B24] resize-none"
                      rows={3}
                      placeholder="Parlez-vous de vous..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">
                      {user?.bio || 'Aucune bio renseignée'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900">4.8</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Note moyenne</p>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < 4 ? "bg-yellow-400" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900">89%</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Taux de complétion</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "89%" }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
                <span className="text-xl sm:text-2xl font-bold text-gray-900">156h</span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">Temps d'apprentissage</p>
              <p className="text-sm text-green-600 mt-2">+12h ce mois</p>
            </div>
          </div>

          {/* Become Creator CTA - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FFB800] rounded-3xl transform rotate-1 scale-105 opacity-90"></div>
            
            <div className="relative bg-gradient-to-r from-[#FF6B35] via-[#F7931E] to-[#FFB800] rounded-3xl p-6 sm:p-8 text-white overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 animate-pulse"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 animate-pulse delay-1000"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left">
                  <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                    <div className="relative">
                      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                      <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl animate-pulse"></div>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">Devenez Créateur !</h3>
                  </div>
                  <p className="text-white/95 text-base sm:text-lg leading-relaxed max-w-2xl">
                    Transformez votre expertise en revenus. Rejoignez notre communauté de créateurs et commencez à partager vos connaissances avec des milliers d'étudiants.
                  </p>
                  
                  <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm">
                      <Crown className="w-3 h-3 sm:w-4 sm:h-4" />
                      Revenus passifs
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm">
                      <Rocket className="w-3 h-3 sm:w-4 sm:h-4" />
                      Communauté active
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs sm:text-sm">
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                      Support complet
                    </div>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(255, 107, 53, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = `/${locale}/dashboard/creator/become`}
                  className="group relative inline-flex items-center gap-3 px-6 sm:px-10 py-3 sm:py-5 bg-white text-[#FF6B35] rounded-2xl font-black text-base sm:text-lg tracking-wider shadow-2xl hover:shadow-[#FF6B35]/25 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  
                  <span className="relative z-10 flex items-center gap-3">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform" />
                    <span className="hidden sm:inline">Devenir Créateur</span>
                    <span className="sm:hidden">Créateur</span>
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                  </span>
                  
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-1 -z-10">
                    <div className="bg-white rounded-2xl w-full h-full"></div>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity - Responsive */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8"
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">Activité récente</h3>
            <div className="space-y-3 sm:space-y-4">
              {[
                {
                  title: "React Avancé",
                  progress: 75,
                  lastAccessed: "Il y a 2 jours",
                  icon: BookOpen,
                },
                {
                  title: "TypeScript Masterclass",
                  progress: 100,
                  lastAccessed: "Il y a 1 semaine",
                  icon: Award,
                },
                {
                  title: "Node.js Backend",
                  progress: 45,
                  lastAccessed: "Il y a 3 jours",
                  icon: BookOpen,
                },
              ].map((course, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-[#002B24]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <course.icon className="w-6 h-6 text-[#002B24]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 truncate">{course.title}</h4>
                      <p className="text-sm text-gray-600">{course.lastAccessed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="text-right w-full sm:w-auto">
                      <p className="text-sm font-medium text-gray-900">{course.progress}%</p>
                      <div className="w-full sm:w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#002B24] h-2 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}