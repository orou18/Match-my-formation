"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserIdManager from "@/lib/user-id-manager";
import { User, Briefcase, CheckCircle } from "lucide-react";

export default function BecomeCreatorPage() {
  const params = useParams<{ locale?: string }>();
  const router = useRouter();
  const locale = typeof params?.locale === "string" ? params.locale : "fr";
  const [formData, setFormData] = useState({
    companyName: "",
    specialization: "",
    description: "",
    website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = UserIdManager.getStoredUserData();
    const token = localStorage.getItem("token");

    if (!user || !token) {
      setStatusMessage("Vous devez être connecté en tant qu'étudiant.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/admin/creator-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentName: user.name,
          studentEmail: user.email,
          motivation: formData.description,
          expertise: formData.companyName,
          category: formData.specialization || "general",
          website: formData.website,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        setStatusMessage(payload.error || "Impossible d'envoyer la demande.");
        return;
      }

      setStatusMessage(
        "Votre demande a bien été envoyée à l'administration. Vous recevrez vos accès créateur après validation."
      );
      setTimeout(() => {
        router.push(`/${locale}/dashboard/student/profile`);
      }, 1500);
    } catch {
      setStatusMessage("Une erreur technique est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/20 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Devenez créateur MatchMyFormation
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Rejoignez notre communauté de créateurs et partagez votre expertise
            avec des milliers d&apos;apprenants
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire principal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Créez votre profil créateur
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Nom de votre entreprise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialisation
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
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
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
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
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://votre-site.com"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <CheckCircle className="w-5 h-5" />
                {isSubmitting
                  ? "Envoi de la demande..."
                  : "Envoyer ma demande créateur"}
              </button>

              {statusMessage ? (
                <p className="text-sm text-center text-gray-600">
                  {statusMessage}
                </p>
              ) : null}
            </form>
          </motion.div>

          {/* Bénéfices */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Gagnez en visibilité
                </h3>
              </div>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Accès à des milliers d&apos;apprenants potentiels</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Monétisez votre expertise grâce à nos outils</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>
                    Interface simple et intuitive pour créer vos formations
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Support dédié et communauté active</span>
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Gérez vos formations
                </h3>
              </div>
              <ul className="space-y-4 text-white/90">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Créez et gérez vos cours facilement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Suivez vos performances en temps réel</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Recevez les paiements directement</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-1" />
                  <span>Accès à des outils marketing avancés</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
