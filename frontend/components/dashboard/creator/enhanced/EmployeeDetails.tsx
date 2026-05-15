"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Key,
  Shield,
  Calendar,
  Briefcase,
  BookOpen,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  QrCode,
  Send,
  RefreshCw,
} from "lucide-react";

interface Employee {
  id: number;
  creator_id: number;
  name: string;
  email: string;
  login_id: string;
  password?: string;
  domain: string;
  department?: string;
  position?: string;
  role?: string;
  hire_date?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

interface LoginCredentials {
  email: string;
  login_id: string;
  password: string;
}

interface EmployeeDetailsProps {
  employeeId: string;
  onBack: () => void;
}

export default function EmployeeDetails({ employeeId, onBack }: EmployeeDetailsProps) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [credentials, setCredentials] = useState<LoginCredentials | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [sendingAccess, setSendingAccess] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    loadEmployeeDetails();
  }, [employeeId]);

  const loadEmployeeDetails = async () => {
    try {
      setLoading(true);
      
      // Récupérer les détails de l'employé
      const response = await fetch(`/api/creator/employees/${employeeId}`);
      const result = await response.json();
      
      if (result.success) {
        setEmployee(result.data);
        
        // Si les identifiants sont inclus dans la réponse
        if (result.login_credentials) {
          setCredentials(result.login_credentials);
        }
      } else {
        console.error("Erreur lors du chargement des détails de l'employé:", result.message);
      }
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error("Erreur lors de la copie:", error);
    }
  };

  const regenerateCredentials = async () => {
    try {
      setRegenerating(true);
      
      const response = await fetch(`/api/creator/employees/${employeeId}/regenerate-credentials`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setCredentials(result.login_credentials);
        // Mettre à jour les données de l'employé si nécessaire
        await loadEmployeeDetails();
      } else {
        console.error("Erreur lors de la régénération:", result.message);
      }
    } catch (error) {
      console.error("Erreur de régénération:", error);
    } finally {
      setRegenerating(false);
    }
  };

  const sendAccessByEmail = async () => {
    try {
      setSendingAccess(true);
      
      const response = await fetch(`/api/creator/employees/${employeeId}/send-access`, {
        method: 'POST',
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert("Identifiants envoyés par email avec succès !");
      } else {
        console.error("Erreur lors de l'envoi:", result.message);
        alert("Erreur lors de l'envoi des identifiants par email");
      }
    } catch (error) {
      console.error("Erreur d'envoi:", error);
      alert("Erreur lors de l'envoi des identifiants par email");
    } finally {
      setSendingAccess(false);
    }
  };

  const generateQRCode = async () => {
    try {
      const response = await fetch(`/api/creator/employees/${employeeId}/qr-code`);
      const result = await response.json();
      
      if (result.success) {
        setQrCode(result.qr_code);
      } else {
        console.error("Erreur lors de la génération du QR code:", result.message);
      }
    } catch (error) {
      console.error("Erreur de génération QR code:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Employé non trouvé</h3>
        <p className="text-gray-500 mb-4">L'employé demandé n'existe pas ou a été supprimé</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Détails de l'employé</h1>
            <p className="text-gray-600">Informations et identifiants de connexion</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              employee.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {employee.is_active ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>

      {/* Informations générales */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-purple-600" />
          Informations générales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <p className="text-gray-900">{employee.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{employee.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Département</label>
            <p className="text-gray-900">{employee.department || "Non spécifié"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
            <p className="text-gray-900">{employee.position || "Non spécifié"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'embauche</label>
            <p className="text-gray-900">
              {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('fr-FR') : "Non spécifiée"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dernière connexion</label>
            <p className="text-gray-900">
              {employee.last_login_at 
                ? new Date(employee.last_login_at).toLocaleDateString('fr-FR') 
                : "Jamais"}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Identifiants de connexion */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Key className="w-5 h-5 mr-2 text-purple-600" />
            Identifiants de connexion
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={regenerateCredentials}
              disabled={regenerating}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${regenerating ? 'animate-spin' : ''}`} />
              Régénérer
            </button>
            <button
              onClick={sendAccessByEmail}
              disabled={sendingAccess}
              className="flex items-center px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4 mr-1" />
              Envoyer par email
            </button>
            <button
              onClick={generateQRCode}
              className="flex items-center px-3 py-1 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <QrCode className="w-4 h-4 mr-1" />
              QR Code
            </button>
          </div>
        </div>

        {credentials ? (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email de connexion</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={credentials.email}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                />
                <button
                  onClick={() => copyToClipboard(credentials.email, 'email')}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {copied === 'email' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">ID de connexion</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={credentials.login_id}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                />
                <button
                  onClick={() => copyToClipboard(credentials.login_id, 'login_id')}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {copied === 'login_id' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="flex items-center space-x-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => copyToClipboard(credentials.password, 'password')}
                  className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                >
                  {copied === 'password' ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Les identifiants de connexion ne sont pas disponibles</p>
            <button
              onClick={regenerateCredentials}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Générer de nouveaux identifiants
            </button>
          </div>
        )}
      </motion.div>

      {/* QR Code Modal */}
      {qrCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code de connexion</h3>
            <div className="flex justify-center mb-4">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
            <p className="text-sm text-gray-600 text-center mb-4">
              Scannez ce QR code pour vous connecter rapidement
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setQrCode(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
