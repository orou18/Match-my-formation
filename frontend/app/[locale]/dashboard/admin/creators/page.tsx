"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  TrendingUp,
  Users,
  DollarSign,
  Video,
  Star,
  Award,
  Calendar,
  Download,
  MoreVertical,
  BarChart3,
  Play,
} from "lucide-react";

interface Creator {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "pending" | "suspended";
  joinDate: string;
  courses: number;
  students: number;
  revenue: number;
  rating: number;
  totalViews: number;
  category: string;
}

export default function AdminCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCreator, setNewCreator] = useState({
    name: "",
    email: "",
    category: "Marketing",
    bio: "",
    expertise: "",
  });

  const mockCreators: Creator[] = [
    {
      id: "1",
      name: "Sophie Laurent",
      email: "sophie.laurent@email.com",
      status: "active",
      joinDate: "2023-06-15",
      courses: 12,
      students: 2847,
      revenue: 45678,
      rating: 4.8,
      totalViews: 125000,
      category: "Marketing",
      avatar: "/temoignage.png",
    },
    {
      id: "2",
      name: "Marc Bernard",
      email: "marc.bernard@email.com",
      status: "active",
      joinDate: "2023-08-20",
      courses: 8,
      students: 1523,
      revenue: 28900,
      rating: 4.6,
      totalViews: 89000,
      category: "Développement",
      avatar: "/temoignage.png",
    },
    {
      id: "3",
      name: "Julie Martin",
      email: "julie.martin@email.com",
      status: "pending",
      joinDate: "2024-01-10",
      courses: 3,
      students: 456,
      revenue: 5400,
      rating: 4.9,
      totalViews: 23000,
      category: "Design",
      avatar: "/temoignage.png",
    },
    {
      id: "4",
      name: "Thomas Dubois",
      email: "thomas.dubois@email.com",
      status: "active",
      joinDate: "2023-03-25",
      courses: 15,
      students: 3421,
      revenue: 67800,
      rating: 4.7,
      totalViews: 198000,
      category: "Business",
      avatar: "/temoignage.png",
    },
    {
      id: "5",
      name: "Emma Durand",
      email: "emma.durand@email.com",
      status: "suspended",
      joinDate: "2023-11-08",
      courses: 5,
      students: 892,
      revenue: 12300,
      rating: 4.2,
      totalViews: 45000,
      category: "Photographie",
      avatar: "/temoignage.png",
    },
  ];

  useEffect(() => {
    const loadCreators = async () => {
      try {
        const response = await fetch("/api/admin/creators");
        if (response.ok) {
          const data = await response.json();
          setCreators(data.creators);
        } else {
          console.error("Erreur lors du chargement des créateurs");
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCreators();
  }, []);

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || creator.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || creator.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "suspended":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const handleCreateCreator = async () => {
    if (!newCreator.name || !newCreator.email || !newCreator.category) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const response = await fetch("/api/admin/creators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCreator),
      });

      if (response.ok) {
        const createdCreator = await response.json();
        setCreators([...creators, createdCreator]);
        setShowCreateModal(false);
        setNewCreator({
          name: "",
          email: "",
          category: "Marketing",
          bio: "",
          expertise: "",
        });
        alert("Créateur créé avec succès!");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création");
    }
  };

  const handleUpdateCreator = async (creatorId: string, updates: any) => {
    try {
      const response = await fetch("/api/admin/creators", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: creatorId, ...updates }),
      });

      if (response.ok) {
        const updatedCreator = await response.json();
        setCreators(
          creators.map((creator) =>
            creator.id === creatorId ? updatedCreator : creator
          )
        );
        alert("Créateur mis à jour avec succès!");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteCreator = async (creatorId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce créateur?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/creators?id=${creatorId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCreators(creators.filter((creator) => creator.id !== creatorId));
        alert("Créateur supprimé avec succès!");
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion Créateurs
          </h1>
          <p className="text-gray-600 mt-1">
            {filteredCreators.length} créateurs trouvés
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={18} />
            Exporter
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Nouveau Créateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          {
            label: "Total Créateurs",
            value: creators.length,
            icon: Users,
            color: "blue",
            change: "+12%",
          },
          {
            label: "Revenus Totaux",
            value: formatCurrency(
              creators.reduce((sum, c) => sum + c.revenue, 0)
            ),
            icon: DollarSign,
            color: "green",
            change: "+23%",
          },
          {
            label: "Étudiants Totaux",
            value: formatNumber(
              creators.reduce((sum, c) => sum + c.students, 0)
            ),
            icon: Users,
            color: "purple",
            change: "+18%",
          },
          {
            label: "Vues Totales",
            value: formatNumber(
              creators.reduce((sum, c) => sum + c.totalViews, 0)
            ),
            icon: Play,
            color: "orange",
            change: "+31%",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-${stat.color}-50`}>
                <stat.icon size={20} className={`text-${stat.color}-600`} />
              </div>
              <span className="text-green-600 text-sm font-bold">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Rechercher un créateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Marketing">Marketing</option>
              <option value="Développement">Développement</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
              <option value="Photographie">Photographie</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <Users size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{creator.name}</h3>
                    <p className="text-sm text-gray-500">{creator.email}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(creator.status)}`}
                >
                  {creator.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Video size={16} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-lg font-bold text-gray-900">
                    {creator.courses}
                  </p>
                  <p className="text-xs text-gray-500">Cours</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Users size={16} className="mx-auto text-gray-600 mb-1" />
                  <p className="text-lg font-bold text-gray-900">
                    {formatNumber(creator.students)}
                  </p>
                  <p className="text-xs text-gray-500">Étudiants</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-900">
                    {creator.rating}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(creator.revenue)}
                  </p>
                  <p className="text-xs text-gray-500">Revenus</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{formatNumber(creator.totalViews)} vues</span>
                <span>{creator.category}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 p-4 bg-gray-50">
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-1">
                  <Eye size={14} />
                  Voir
                </button>
                <button className="flex-1 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1">
                  <BarChart3 size={14} />
                  Stats
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
