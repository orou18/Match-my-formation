"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Upload,
  Image,
  X,
  Plus,
  Minus,
  CheckCircle,
} from "lucide-react";

interface ProfileSetupStepProps {
  step: number;
  onNext: () => void;
  onPrevious: () => void;
  onSave: () => void;
}

export default function ProfileSetupStep({ step, onNext, onPrevious, onSave }: ProfileSetupStepProps) {
  const [profileData, setProfileData] = useState({
    companyName: "",
    specialization: "",
    description: "",
    website: "",
    profilePhoto: null,
    coverPhoto: null,
  });

  const handleImageUpload = (type: "profile" | "cover") => {
    // TODO: Implement image upload
    console.log(`Upload ${type} photo`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Personnalisez votre profil créateur
      </h2>

      {/* Profile Photo */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Photo de profil
        </label>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group cursor-pointer">
            {profileData.profilePhoto ? (
              <img 
                src={profileData.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Plus className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Téléchargez une photo professionnelle (format carré recommandé)
            </p>
            <button 
              onClick={() => handleImageUpload("profile")}
              className="text-sm text-primary hover:underline"
            >
              Choisir une photo
            </button>
          </div>
        </div>
      </div>

      {/* Cover Photo */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Photo de couverture
        </label>
        <div className="w-full h-48 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 relative overflow-hidden group cursor-pointer">
          {profileData.coverPhoto ? (
            <img 
              src={profileData.coverPhoto} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="w-12 h-12 text-gray-400" />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Plus className="w-12 h-12 text-white" />
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise
          </label>
          <input
            type="text"
            value={profileData.companyName}
            onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Spécialisation
          </label>
          <select
            value={profileData.specialization}
            onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Sélectionnez votre spécialisation</option>
            <option value="development">Développement</option>
            <option value="design">Design</option>
            <option value="marketing">Marketing</option>
            <option value="business">Business</option>
            <option value="technology">Technologie</option>
            <option value="education">Éducation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={profileData.description}
            onChange={(e) => setProfileData({ ...profileData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="Décrivez votre expertise et votre expérience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site web (optionnel)
          </label>
          <input
            type="url"
            value={profileData.website}
            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            placeholder="https://votre-site.com"
          />
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Compétences clés
        </label>
        <div className="flex flex-wrap gap-2">
          {["React", "TypeScript", "Laravel", "UX Design", "Marketing"].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                className="ml-2 text-primary/60 hover:text-primary"
                onClick={() => console.log(`Remove skill: ${skill}`)}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            className="px-3 py-1 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            onClick={() => console.log("Add skill")}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onPrevious}
          className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Annuler
        </button>
        <button
          onClick={onSave}
          className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Enregistrer
        </button>
      </div>
    </motion.div>
  );
}
