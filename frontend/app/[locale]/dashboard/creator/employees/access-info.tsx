"use client";
import { motion } from "framer-motion";
import { Mail, QrCode, Key, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function EmployeeAccessInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Comment donner accès à vos employés
          </h3>
          <p className="text-sm text-gray-600">
            Différentes méthodes pour que vos employés accèdent à leur espace de formation
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Email Method */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Email direct</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Envoyez un email avec le lien de connexion et les identifiants
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Lien de connexion personnalisé</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Identifiants inclus</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Instructions claires</span>
            </div>
          </div>
        </motion.div>

        {/* QR Code Method */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <QrCode className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">QR Code</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Générez un QR code pour un accès rapide sur mobile
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-purple-500" />
              <span>Scan instantané</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-purple-500" />
              <span>Idéal pour mobile</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-purple-500" />
              <span>Pas d'email requis</span>
            </div>
          </div>
        </motion.div>

        {/* Manual Method */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Manuel</h4>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Communiquez directement les identifiants de connexion
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-orange-500" />
              <span>Contrôle total</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-orange-500" />
              <span>En personne ou par téléphone</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle className="w-3 h-3 text-orange-500" />
              <span>Réinitialisation possible</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* URL Information */}
      <div className="mt-6 p-4 bg-blue-100 rounded-lg">
        <div className="flex items-center gap-3">
          <ArrowRight className="w-5 h-5 text-blue-600" />
          <div>
            <p className="text-sm font-medium text-blue-900">
              URL de connexion employé :
            </p>
            <p className="text-xs text-blue-700 font-mono bg-white px-2 py-1 rounded mt-1">
              http://localhost:3000/fr/login-employee
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
