"use client";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle,
  CreditCard,
  BookOpen,
  Trash2,
  Check,
} from "lucide-react";

// Définition des types de notifications pour varier les icônes et couleurs
export type NotificationType = "info" | "success" | "billing" | "course";

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  isRead?: boolean;
}

const typeConfig = {
  info: {
    icon: Bell,
    color: "bg-blue-500",
    light: "bg-blue-50",
    text: "text-blue-600",
  },
  success: {
    icon: CheckCircle,
    color: "bg-green-500",
    light: "bg-green-50",
    text: "text-green-600",
  },
  billing: {
    icon: CreditCard,
    color: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-600",
  },
  course: {
    icon: BookOpen,
    color: "bg-primary",
    light: "bg-primary/10",
    text: "text-primary",
  },
};

export default function NotificationItem({
  title,
  description,
  time,
  type,
  isRead = false,
}: NotificationItemProps) {
  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={`group relative flex items-start gap-4 p-5 rounded-[1.5rem] border transition-all duration-300 ${
        isRead
          ? "bg-white/50 border-gray-100 opacity-75"
          : "bg-white border-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] shadow-primary/5"
      }`}
    >
      {/* Indicateur de nouveau message (point bleu) */}
      {!isRead && (
        <span className="absolute top-6 left-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(0,128,128,0.5)]" />
      )}

      {/* Icône stylisée */}
      <div
        className={`w-12 h-12 ${config.light} rounded-2xl flex items-center justify-center ${config.text} shrink-0 transition-transform group-hover:scale-110`}
      >
        <Icon size={22} />
      </div>

      {/* Contenu textuel */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4
            className={`font-bold text-sm md:text-base leading-tight ${isRead ? "text-gray-500" : "text-[#002B24]"}`}
          >
            {title}
          </h4>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap">
            {time}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Actions rapides au survol */}
      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <button
          className="p-2 hover:bg-primary/10 text-primary rounded-xl transition-colors"
          title="Marquer comme lu"
        >
          <Check size={18} />
        </button>
        <button
          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </motion.div>
  );
}
