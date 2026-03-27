"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Building,
  FileText,
  MapPin,
  Mail,
  Phone,
  Globe,
  CheckCircle,
  Send,
} from "lucide-react";

export default function ApplyCreatorPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    siret: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    vatNumber: "",
    trainingType: "",
    trainingDomain: "",
    experience: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log("Application submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Devenir créateur MatchMyFormation
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Rejoignez notre plateforme et partagez votre expertise avec des
            milliers d'apprenants
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations entreprise */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informations sur l'entreprise
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Nom de votre entreprise"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de SIRET *
                  </label>
                  <input
                    type="text"
                    value={formData.siret}
                    onChange={(e) =>
                      setFormData({ ...formData, siret: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="12345678901234"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="123 rue de la République"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Paris"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData({ ...formData, postalCode: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="75001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pays *
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="France"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de TVA intracommunautaire
                  </label>
                  <input
                    type="text"
                    value={formData.vatNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, vatNumber: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="FR12345678901"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email de contact *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="contact@entreprise.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Informations formation */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Informations sur la formation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de formation *
                  </label>
                  <select
                    value={formData.trainingType}
                    onChange={(e) =>
                      setFormData({ ...formData, trainingType: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="online">Formation en ligne</option>
                    <option value="inperson">Formation en présentiel</option>
                    <option value="hybrid">Formation hybride</option>
                    <option value="certification">Certification</option>
                    <option value="coaching">Coaching</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine de formation *
                  </label>
                  <select
                    value={formData.trainingDomain}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        trainingDomain: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    required
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="technology">Technologie</option>
                    <option value="business">Business</option>
                    <option value="marketing">Marketing</option>
                    <option value="design">Design</option>
                    <option value="education">Éducation</option>
                    <option value="health">Santé</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expérience *
                </label>
                <textarea
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Décrivez votre expérience et vos qualifications..."
                  required
                />
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, acceptTerms: e.target.checked })
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  required
                />
                <span className="text-sm text-gray-700">
                  J'accepte les{" "}
                  <a href="#" className="text-primary hover:underline">
                    conditions générales
                  </a>{" "}
                  de la plateforme MatchMyFormation *
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacy}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acceptPrivacy: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  required
                />
                <span className="text-sm text-gray-700">
                  J'ai lu la{" "}
                  <a href="#" className="text-primary hover:underline">
                    politique de confidentialité
                  </a>{" "}
                  *
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Envoyer la demande
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
