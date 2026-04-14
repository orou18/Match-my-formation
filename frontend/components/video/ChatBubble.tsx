"use client";

import React from "react";
import { Heart } from "lucide-react";

interface ChatBubbleProps {
  message: {
    id: number;
    user: {
      id: number;
      name: string;
      email: string;
      profile_picture?: string;
    };
    message: string;
    is_question: boolean;
    status: string;
    likes_count: number;
    created_at: string;
  };
  isOwn?: boolean;
  isCreator?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onLike?: () => void;
  onReply?: () => void;
  repliesCount?: number;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isOwn = false,
  isCreator = false,
  onDelete,
  onEdit,
  onLike,
  onReply,
  repliesCount = 0,
}) => {
  const formatRelativeTime = (value: string) => {
    const target = new Date(value);
    const diffSeconds = Math.round((target.getTime() - Date.now()) / 1000);
    const intervals = [
      { unit: "day", seconds: 86400 },
      { unit: "hour", seconds: 3600 },
      { unit: "minute", seconds: 60 },
    ] as const;

    for (const interval of intervals) {
      if (Math.abs(diffSeconds) >= interval.seconds) {
        return new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(
          Math.round(diffSeconds / interval.seconds),
          interval.unit
        );
      }
    }

    return "à l'instant";
  };

  const getStatusColor = () => {
    switch (message.status) {
      case "answered":
        return "border-l-4 border-l-green-500";
      case "resolved":
        return "border-l-4 border-l-blue-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };

  const getStatusLabel = () => {
    switch (message.status) {
      case "answered":
        return "Répondu";
      case "resolved":
        return "Résolu";
      default:
        return "En attente";
    }
  };

  return (
    <div className={`mb-4 flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
          isOwn
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        } ${getStatusColor()}`}
      >
        {/* Auteur et info */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            {message.user.profile_picture && (
              <img
                src={message.user.profile_picture}
                alt={message.user.name}
                className="w-6 h-6 rounded-full"
              />
            )}
            <span
              className={`font-semibold text-sm ${isOwn ? "text-white" : "text-gray-900"}`}
            >
              {message.user.name}
            </span>
            {isCreator && (
              <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded">
                Creator
              </span>
            )}
            {message.is_question && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded">
                Question
              </span>
            )}
          </div>
        )}

        {/* Message */}
        <p className="text-sm break-words">{message.message}</p>

        {/* Status */}
        {message.is_question && (
          <div className="text-xs mt-2 opacity-70">{getStatusLabel()}</div>
        )}

        {/* Time et Interactions */}
        <div className="flex items-center justify-between gap-2 mt-2 text-xs opacity-70">
          <span>{formatRelativeTime(message.created_at)}</span>

          <div className="flex items-center gap-2">
            {onLike && (
              <button
                onClick={onLike}
                className="flex items-center gap-1 hover:opacity-100 transition-opacity"
              >
                <Heart size={14} />
                <span>{message.likes_count}</span>
              </button>
            )}

            {message.is_question && repliesCount > 0 && (
              <span className="flex items-center gap-1">💬 {repliesCount}</span>
            )}

            {(isOwn || onEdit) && (
              <button
                onClick={onEdit}
                className="hover:opacity-100 transition-opacity"
              >
                ✏️
              </button>
            )}

            {(isOwn || onDelete) && (
              <button
                onClick={onDelete}
                className="hover:opacity-100 transition-opacity hover:text-red-500"
              >
                🗑️
              </button>
            )}

            {onReply && message.is_question && (
              <button
                onClick={onReply}
                className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-xs transition-colors"
              >
                Répondre
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
