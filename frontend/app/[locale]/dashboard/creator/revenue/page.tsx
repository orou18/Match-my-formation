"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Target,
  Wallet,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Video,
  ShoppingCart,
} from "lucide-react";
import { useParams } from "next/navigation";

interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  projectedRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  conversionRate: number;
  totalOrders: number;
  refunds: number;
  revenueBySource: Array<{
    source: string;
    amount: number;
    percentage: number;
    orders: number;
    icon: string;
  }>;
  monthlyTrend: Array<{
    month: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  topProducts: Array<{
    name: string;
    revenue: number;
    orders: number;
    price: number;
  }>;
  recentTransactions: Array<{
    id: string;
    type: 'sale' | 'refund' | 'subscription';
    amount: number;
    customer: string;
    product: string;
    date: string;
    status: 'completed' | 'pending' | 'failed';
  }>;
}

export default function RevenuePage() {
  const params = useParams();
  const locale = params.locale || "fr";
  
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'transactions' | 'analytics'>('overview');

  useEffect(() => {
    // Simuler le chargement des données de revenus
    const mockData: RevenueData = {
      totalRevenue: 28500,
      monthlyRevenue: 3450,
      projectedRevenue: 4200,
      revenueGrowth: 18.5,
      averageOrderValue: 89.99,
      conversionRate: 4.2,
      totalOrders: 317,
      refunds: 12,
      revenueBySource: [
        { source: 'Ventes de cours', amount: 18500, percentage: 65.0, orders: 205, icon: 'video' },
        { source: 'Abonnements', amount: 7500, percentage: 26.3, orders: 45, icon: 'subscription' },
        { source: 'Consultations', amount: 1500, percentage: 5.3, orders: 23, icon: 'consultation' },
        { source: 'Autres', amount: 1000, percentage: 3.4, orders: 44, icon: 'other' },
      ],
      monthlyTrend: [
        { month: 'Jan', revenue: 2100, orders: 28, growth: 0 },
        { month: 'Fev', revenue: 2450, orders: 32, growth: 16.7 },
        { month: 'Mar', revenue: 2800, orders: 35, growth: 14.3 },
        { month: 'Avr', revenue: 3200, orders: 41, growth: 14.3 },
        { month: 'Mai', revenue: 3450, orders: 44, growth: 7.8 },
        { month: 'Jun', revenue: 3450, orders: 43, growth: 0 },
      ],
      topProducts: [
        { name: 'Tourisme Durable Complet', revenue: 8900, orders: 89, price: 99.99 },
        { name: 'Marketing Digital Avancé', revenue: 6200, orders: 78, price: 79.99 },
        { name: 'Gestion Hôtelière', revenue: 4500, orders: 56, price: 79.99 },
        { name: 'Service Client Excellence', revenue: 2800, orders: 45, price: 62.99 },
        { name: 'Abonnement Premium', revenue: 2500, orders: 25, price: 99.99 },
      ],
      recentTransactions: [
        {
          id: '1',
          type: 'sale',
          amount: 99.99,
          customer: 'Alice Martin',
          product: 'Tourisme Durable',
          date: '2024-03-14T10:30:00Z',
          status: 'completed'
        },
        {
          id: '2',
          type: 'subscription',
          amount: 99.99,
          customer: 'Bob Dubois',
          product: 'Abonnement Premium',
          date: '2024-03-14T09:15:00Z',
          status: 'completed'
        },
        {
          id: '3',
          type: 'sale',
          amount: 79.99,
          customer: 'Claire Rousseau',
          product: 'Marketing Digital',
          date: '2024-03-14T08:45:00Z',
          status: 'completed'
        },
        {
          id: '4',
          type: 'refund',
          amount: -99.99,
          customer: 'David Bernard',
          product: 'Gestion Hôtelière',
          date: '2024-03-13T18:20:00Z',
          status: 'completed'
        },
        {
          id: '5',
          type: 'sale',
          amount: 62.99,
          customer: 'Emma Petit',
          product: 'Service Client',
          date: '2024-03-13T14:10:00Z',
          status: 'pending'
        },
      ]
    };

    setTimeout(() => {
      setRevenueData(mockData);
      setLoading(false);
    }, 1200);
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSourceIcon = (icon: string) => {
    switch (icon) {
      case 'video':
        return <Video className="w-5 h-5 text-blue-600" />;
      case 'subscription':
        return <Users className="w-5 h-5 text-purple-600" />;
      case 'consultation':
        return <Target className="w-5 h-5 text-green-600" />;
      default:
        return <ShoppingCart className="w-5 h-5 text-gray-600" />;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!revenueData) return null;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="w-8 h-8 text-green-600" />
            Revenus
          </h1>
          <p className="text-gray-600 mt-1">
            Suivez vos revenus et performances financières
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Sélecteur de période */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
            <option value="90d">90 jours</option>
            <option value="1y">1 an</option>
          </select>
          
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </button>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          {[
            { id: 'overview', label: 'Aperçu', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: Receipt },
            { id: 'analytics', label: 'Analytiques', icon: PieChart },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 font-medium text-sm transition-colors ${
                selectedView === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(revenueData.totalRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Revenu total</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+{revenueData.revenueGrowth}%</span>
            <span className="text-gray-500">vs période précédente</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatCurrency(revenueData.monthlyRevenue)}
              </h3>
              <p className="text-sm text-gray-600">Ce mois</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-gray-600">
              Prévu: {formatCurrency(revenueData.projectedRevenue)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {formatNumber(revenueData.totalOrders)}
              </h3>
              <p className="text-sm text-gray-600">Commandes totales</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">
              Panier moyen: {formatCurrency(revenueData.averageOrderValue)}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-50 rounded-xl">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{revenueData.conversionRate}%</h3>
              <p className="text-sm text-gray-600">Taux de conversion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-green-600">+0.8%</span>
            <span className="text-gray-500">vs période précédente</span>
          </div>
        </motion.div>
      </div>

      {/* Content based on selected view */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue by Source */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenus par source</h2>
            <div className="space-y-4">
              {revenueData.revenueBySource.map((source) => (
                <div key={source.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSourceIcon(source.icon)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{source.source}</p>
                      <p className="text-xs text-gray-500">{source.orders} commandes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(source.amount)}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">{source.percentage}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${source.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Produits les plus vendus</h2>
            <div className="space-y-3">
              {revenueData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-600 w-6">{index + 1}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.orders} ventes</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(product.price)} chacun</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {selectedView === 'transactions' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100"
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transactions récentes</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Produit</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Montant</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {revenueData.recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">{transaction.customer}</td>
                      <td className="py-3 px-4 text-sm">{transaction.product}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'sale' ? 'bg-green-100 text-green-800' :
                          transaction.type === 'subscription' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type === 'sale' ? 'Vente' :
                           transaction.type === 'subscription' ? 'Abonnement' : 'Remboursement'}
                        </span>
                      </td>
                      <td className={`py-3 px-4 text-sm font-medium ${
                        transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">{formatDate(transaction.date)}</td>
                      <td className="py-3 px-4">{getStatusIcon(transaction.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {selectedView === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tendance mensuelle</h2>
            <div className="space-y-3">
              {revenueData.monthlyTrend.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600 w-12">{month.month}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(month.revenue)}
                        </span>
                        <span className={`text-xs font-medium ${
                          month.growth > 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {month.growth > 0 ? '+' : ''}{month.growth}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(month.revenue / revenueData.monthlyRevenue) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Métriques de performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Panier moyen</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {formatCurrency(revenueData.averageOrderValue)}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Taux de conversion</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{revenueData.conversionRate}%</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">Remboursements</span>
                </div>
                <span className="text-sm font-bold text-red-600">{revenueData.refunds}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">Croissance</span>
                </div>
                <span className="text-sm font-bold text-green-600">+{revenueData.revenueGrowth}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
