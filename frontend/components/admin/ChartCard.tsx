"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Activity } from "lucide-react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  gradient?: boolean;
}

export default function ChartCard({ 
  title, 
  subtitle, 
  children, 
  icon,
  gradient = false 
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -3,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 ${
        gradient ? 'bg-gradient-to-br from-blue-50 to-purple-50' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        {icon && (
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="text-blue-600"
          >
            {icon}
          </motion.div>
        )}
      </div>
      
      <div className="h-64">
        {children}
      </div>
    </motion.div>
  );
}
