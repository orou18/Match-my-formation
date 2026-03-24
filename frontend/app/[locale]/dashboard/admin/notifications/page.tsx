"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Plus,
  Bell,
  BellRing,
  Send,
  Trash2,
  Eye,
  Calendar,
  User,
  Filter,
  BarChart3,
  TrendingUp,
  Clock,
  MoreVertical,
  Mail,
  MessageSquare,
  AlertCircle,
  Check,
  X,
  Users,
  Target,
  Star,
  Shield,
  Edit
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  target: 'all' | 'users' | 'creators' | 'admins';
  status: 'draft' | 'scheduled' | 'sent';
  scheduledAt?: string;
  sentAt?: string;
  recipients: number;
  openedCount: number;
  clickedCount: number;
  createdBy: string;
  createdAt: string;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    target: 'all',
    status: 'draft',
    scheduledAt: ''
  });

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetch('/api/admin/notifications');
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        } else {
          console.error('Erreur lors du chargement des notifications');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: "Nouveau cours disponible",
      message: "Découvrez notre nouveau cours sur le marketing digital pour les créateurs",
      type: "info",
      target: "all",
      status: "sent",
      sentAt: "2024-03-15T10:00:00Z",
      recipients: 2847,
      openedCount: 1256,
      clickedCount: 423,
      createdBy: "Jean Dupont",
      createdAt: "2024-03-15T09:30:00Z"
    },
    {
      id: '2',
      title: "Maintenance système",
      message: "Une maintenance est prévue ce soir de 22h à 23h",
      type: "warning",
      target: "all",
      status: "scheduled",
      scheduledAt: "2024-03-20T22:00:00Z",
      recipients: 2847,
      openedCount: 0,
      clickedCount: 0,
      createdBy: "Marie Dubois",
      createdAt: "2024-03-18T14:00:00Z"
    },
    {
      id: '3',
      title: "Félicitations créateurs!",
      message: "Les créateurs ont généré 23% de revenus supplémentaires ce mois",
      type: "success",
      target: "creators",
      status: "sent",
      sentAt: "2024-03-10T16:00:00Z",
      recipients: 156,
      openedCount: 89,
      clickedCount: 34,
      createdBy: "Sophie Martin",
      createdAt: "2024-03-10T15:45:00Z"
    },
    {
      id: '4',
      title: "Mise à jour importante",
      message: "Veuillez mettre à jour votre profil pour bénéficier des nouvelles fonctionnalités",
      type: "error",
      target: "users",
      status: "draft",
      recipients: 2691,
      openedCount: 0,
      clickedCount: 0,
      createdBy: "Pierre Bernard",
      createdAt: "2024-03-18T10:00:00Z"
    }
  ];

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message || !newNotification.type || !newNotification.target) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNotification),
      });

      if (response.ok) {
        const createdNotification = await response.json();
        setNotifications([...notifications, createdNotification]);
        setShowCreateModal(false);
        setNewNotification({
          title: '',
          message: '',
          type: 'info',
          target: 'all',
          status: 'draft',
          scheduledAt: ''
        });
        alert('Notification créée avec succès!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la création');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création');
    }
  };

  const handleUpdateNotification = async (notificationId: string, updates: any) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: notificationId, ...updates }),
      });

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications(notifications.map(notification => notification.id === notificationId ? updatedNotification : notification));
        alert('Notification mise à jour avec succès!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette notification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/notifications?id=${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
        alert('Notification supprimée avec succès!');
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-700';
      case 'success':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return AlertCircle;
      case 'success':
        return Check;
      case 'warning':
        return AlertCircle;
      case 'error':
        return X;
      default:
        return Bell;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTargetBadge = (target: string) => {
    switch (target) {
      case 'all':
        return 'bg-purple-100 text-purple-700';
      case 'users':
        return 'bg-blue-100 text-blue-700';
      case 'creators':
        return 'bg-orange-100 text-orange-700';
      case 'admins':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'all':
        return Users;
      case 'users':
        return User;
      case 'creators':
        return Star;
      case 'admins':
        return Shield;
      default:
        return Users;
    }
  };

  const getOpenRate = (notification: Notification) => {
    if (notification.recipients === 0) return 0;
    return Math.round((notification.openedCount / notification.recipients) * 100);
  };

  const getClickRate = (notification: Notification) => {
    if (notification.openedCount === 0) return 0;
    return Math.round((notification.clickedCount / notification.openedCount) * 100);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion Notifications</h1>
          <p className="text-gray-600 mt-1">{filteredNotifications.length} notifications</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <BarChart3 size={18} />
            Analytics
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Nouvelle Notification
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {[
          { 
            label: "Total Envoyées", 
            value: notifications.filter(n => n.status === 'sent').length, 
            icon: Send, 
            color: "green",
            change: "+12%" 
          },
          { 
            label: "Taux Ouverture", 
            value: "44.2%", 
            icon: Eye, 
            color: "blue",
            change: "+5%" 
          },
          { 
            label: "Taux Clic", 
            value: "18.7%", 
            icon: Target, 
            color: "purple",
            change: "+3%" 
          },
          { 
            label: "Programmées", 
            value: notifications.filter(n => n.status === 'scheduled').length, 
            icon: Clock, 
            color: "orange",
            change: "+2" 
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
              <span className="text-green-600 text-sm font-bold">{stat.change}</span>
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
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher une notification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous types</option>
              <option value="info">Information</option>
              <option value="success">Succès</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="sent">Envoyée</option>
              <option value="scheduled">Programmée</option>
              <option value="draft">Brouillon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification, index) => {
          const TypeIcon = getTypeIcon(notification.type);
          const TargetIcon = getTargetIcon(notification.target);
          
          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getTypeBadge(notification.type)}`}>
                      <TypeIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{notification.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getTypeBadge(notification.type)}`}>
                          {notification.type}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getTargetBadge(notification.target)}`}>
                          <TargetIcon size={12} />
                          {notification.target === 'all' ? 'Tous' :
                           notification.target === 'users' ? 'Utilisateurs' :
                           notification.target === 'creators' ? 'Créateurs' : 'Admins'}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusBadge(notification.status)}`}>
                          {notification.status === 'sent' ? 'Envoyée' :
                           notification.status === 'scheduled' ? 'Programmée' : 'Brouillon'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                {notification.status === 'sent' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Users size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-lg font-bold text-gray-900">{notification.recipients.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Destinataires</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Eye size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-lg font-bold text-gray-900">{getOpenRate(notification)}%</p>
                      <p className="text-xs text-gray-500">Taux ouverture</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Target size={14} className="mx-auto text-gray-600 mb-1" />
                      <p className="text-lg font-bold text-gray-900">{getClickRate(notification)}%</p>
                      <p className="text-xs text-gray-500">Taux clic</p>
                    </div>
                  </div>
                )}

                {/* Date Info */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Créée le {new Date(notification.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>Par {notification.createdBy}</span>
                    </div>
                  </div>
                  {notification.scheduledAt && (
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Programmée pour {new Date(notification.scheduledAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-2xl"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Nouvelle Notification</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  placeholder="Titre de la notification"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Contenu de la notification"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="info">Information</option>
                    <option value="success">Succès</option>
                    <option value="warning">Avertissement</option>
                    <option value="error">Erreur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cible
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">Tous les utilisateurs</option>
                    <option value="users">Utilisateurs uniquement</option>
                    <option value="creators">Créateurs uniquement</option>
                    <option value="admins">Administrateurs uniquement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="draft">Brouillon</option>
                    <option value="scheduled">Programmer</option>
                    <option value="sent">Envoyer immédiatement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'envoi (si programmé)
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Créer la Notification
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
