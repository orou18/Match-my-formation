"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  History,
  Search,
  Filter,
  Download,
  Eye,
  Users,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  FileText,
  Video,
} from "lucide-react";

interface HistoryItem {
  id: string;
  type: "enrollment" | "payment" | "video_upload" | "course_update" | "refund";
  title: string;
  description: string;
  amount?: number;
  studentName?: string;
  videoTitle?: string;
  timestamp: string;
  status: "completed" | "pending" | "failed" | "processing";
  metadata?: {
    videoId?: string;
    studentId?: string;
    transactionId?: string;
  };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "enrollment" | "payment" | "video" | "refund">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    // Simuler le chargement de l'historique
    const mockHistory: HistoryItem[] = [
      {
        id: "1",
        type: "enrollment",
        title: "Nouvelle inscription",
        description: "Jean Dupont s'est inscrit à 'Tourisme Durable'",
        studentName: "Jean Dupont",
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        status: "completed",
        metadata: {
          studentId: "stu_123",
          videoId: "vid_456"
        }
      },
      {
        id: "2",
        type: "payment",
        title: "Paiement reçu",
        description: "Paiement de Marie Martin pour 'Gestion Hôtelière'",
        amount: 89.99,
        studentName: "Marie Martin",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        status: "completed",
        metadata: {
          transactionId: "txn_789",
          studentId: "stu_456"
        }
      },
      {
        id: "3",
        type: "video_upload",
        title: "Vidéo uploadée",
        description: "Nouvelle vidéo 'Service Client Excellence' ajoutée",
        videoTitle: "Service Client Excellence",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        status: "completed",
        metadata: {
          videoId: "vid_789"
        }
      },
      {
        id: "4",
        type: "enrollment",
        title: "Inscription groupée",
        description: "5 étudiants se sont inscrits à 'Marketing Touristique'",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        status: "completed",
        metadata: {
          videoId: "vid_234"
        }
      },
      {
        id: "5",
        type: "payment",
        title: "Paiement en attente",
        description: "Paiement en cours de validation pour Pierre Bernard",
        amount: 67.50,
        studentName: "Pierre Bernard",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        status: "pending",
        metadata: {
          transactionId: "txn_456",
          studentId: "stu_789"
        }
      },
      {
        id: "6",
        type: "course_update",
        title: "Mise à jour de formation",
        description: "Mise à jour du contenu de 'Introduction au Tourisme'",
        videoTitle: "Introduction au Tourisme",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        status: "completed",
        metadata: {
          videoId: "vid_123"
        }
      },
      {
        id: "7",
        type: "refund",
        title: "Remboursement traité",
        description: "Remboursement pour Sophie Lefebvre - 'Guide Touristique'",
        amount: -45.00,
        studentName: "Sophie Lefebvre",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        status: "completed",
        metadata: {
          transactionId: "ref_123",
          studentId: "stu_321"
        }
      },
      {
        id: "8",
        type: "video_upload",
        title: "Vidéo modifiée",
        description: "Mise à jour de 'Réservation et Revenue Management'",
        videoTitle: "Réservation et Revenue Management",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        status: "completed",
        metadata: {
          videoId: "vid_567"
        }
      }
    ];

    setTimeout(() => {
      setHistory(mockHistory);
      setLoading(false);
    }, 1200);
  }, []);

  const getTypeIcon = (type: HistoryItem["type"]) => {
    switch (type) {
      case "enrollment":
        return <Users className="w-5 h-5 text-blue-500" />;
      case "payment":
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case "video_upload":
      case "course_update":
        return <Video className="w-5 h-5 text-purple-500" />;
      case "refund":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: HistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: HistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200 text-green-800";
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "failed":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  const getTypeLabel = (type: HistoryItem["type"]) => {
    switch (type) {
      case "enrollment":
        return "Inscription";
      case "payment":
        return "Paiement";
      case "video_upload":
        return "Upload vidéo";
      case "course_update":
        return "Mise à jour";
      case "refund":
        return "Remboursement";
      default:
        return "Autre";
    }
  };

  const getStatusLabel = (status: HistoryItem["status"]) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En attente";
      case "failed":
        return "Échec";
      case "processing":
        return "En cours";
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportHistory = () => {
    const csvContent = [
      ["Date", "Type", "Titre", "Description", "Montant", "Statut"],
      ...filteredHistory.map(item => [
        formatDate(item.timestamp),
        getTypeLabel(item.type),
        item.title,
        item.description,
        item.amount ? formatCurrency(item.amount) : "",
        getStatusLabel(item.status)
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historique-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredHistory = history.filter(item => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "enrollment" && item.type === "enrollment") ||
      (filter === "payment" && item.type === "payment") ||
      (filter === "video" && (item.type === "video_upload" || item.type === "course_update")) ||
      (filter === "refund" && item.type === "refund");
    
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.videoTitle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = dateRange === "all" || (
      new Date(item.timestamp) >= new Date(Date.now() - (
        dateRange === "7d" ? 7 * 24 * 60 * 60 * 1000 :
        dateRange === "30d" ? 30 * 24 * 60 * 60 * 1000 :
        90 * 24 * 60 * 60 * 1000
      ))
    );
    
    return matchesFilter && matchesSearch && matchesDate;
  });

  const totalRevenue = filteredHistory
    .filter(item => item.type === "payment" && item.status === "completed")
    .reduce((sum, item) => sum + (item.amount || 0), 0);

  const totalRefunds = Math.abs(filteredHistory
    .filter(item => item.type === "refund" && item.status === "completed")
    .reduce((sum, item) => sum + (item.amount || 0), 0));

  const totalEnrollments = filteredHistory
    .filter(item => item.type === "enrollment" && item.status === "completed")
    .length;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl p-8 animate-pulse">
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <History className="w-8 h-8 text-primary" />
            Historique
          </h1>
          <p className="text-gray-600">
            Consultez toutes vos activités et transactions
          </p>
        </div>
        
        <button
          onClick={exportHistory}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {totalEnrollments}
              </h3>
              <p className="text-sm text-gray-600">Inscriptions</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Revenus générés</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-xl">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalRefunds)}
              </h3>
              <p className="text-sm text-gray-600">Remboursements</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-2">
            {[
              { value: "all", label: "Tout" },
              { value: "enrollment", label: "Inscriptions" },
              { value: "payment", label: "Paiements" },
              { value: "video", label: "Vidéos" },
              { value: "refund", label: "Remboursements" }
            ].map((filterType) => (
              <button
                key={filterType.value}
                onClick={() => setFilter(filterType.value as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === filterType.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filterType.label}
              </button>
            ))}
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="all">Toute la période</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {filteredHistory.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "Aucune activité trouvée" : "Aucune activité"}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? "Essayez de modifier votre recherche ou vos filtres"
                : "Vous n'avez pas encore d'activité enregistrée"
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {getTypeIcon(item.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {item.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                          <span className="text-gray-500">
                            {getTypeLabel(item.type)}
                          </span>
                          {item.amount && (
                            <span className={`font-medium ${
                              item.amount > 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {formatCurrency(item.amount)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(item.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
