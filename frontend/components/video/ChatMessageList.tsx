"use client";

import React, { useEffect, useRef } from "react";
import { ChatBubble } from "./ChatBubble";
import { useSession } from "next-auth/react";
import { MessageCircle } from "lucide-react";

interface Message {
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
  replies_count: number;
  created_at: string;
  replies?: Reply[];
}

interface Reply {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
    profile_picture?: string;
  };
  message: string;
  created_at: string;
}

interface ChatMessageListProps {
  messages: Message[];
  isLoading?: boolean;
  creatorId?: number;
  currentUserId?: number;
  onDeleteMessage?: (messageId: number) => Promise<void>;
  onLikeMessage?: (messageId: number) => Promise<void>;
  onReplyClick?: (messageId: number) => void;
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  isLoading = false,
  creatorId,
  currentUserId,
  onDeleteMessage,
  onLikeMessage,
  onReplyClick,
}) => {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin mb-3">
            <MessageCircle size={32} className="mx-auto" />
          </div>
          <p>Chargement des messages...</p>
        </div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center text-gray-500">
          <MessageCircle size={48} className="mx-auto mb-3 opacity-50" />
          <h3 className="font-semibold mb-2">Aucun message pour le moment</h3>
          <p className="text-sm">
            Soyez le premier à poser une question ou laisser un commentaire!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {messages.map((msg) => (
        <div key={msg.id} className="space-y-2">
          {/* Main Message */}
          <ChatBubble
            message={msg}
            isOwn={msg.user.id === currentUserId}
            isCreator={msg.user.id === creatorId}
            onDelete={
              msg.user.id === currentUserId && onDeleteMessage
                ? () => onDeleteMessage(msg.id)
                : undefined
            }
            onLike={onLikeMessage ? () => onLikeMessage(msg.id) : undefined}
            onReply={
              msg.is_question && creatorId === currentUserId && onReplyClick
                ? () => onReplyClick(msg.id)
                : undefined
            }
            repliesCount={msg.replies_count}
          />

          {/* Replies */}
          {msg.replies && msg.replies.length > 0 && (
            <div className="ml-4 pl-4 border-l-2 border-green-300 space-y-2">
              {msg.replies.map((reply) => (
                <ChatBubble
                  key={reply.id}
                  message={{
                    ...reply,
                    id: reply.id,
                    is_question: false,
                    status: "answered",
                    likes_count: 0,
                  }}
                  isOwn={reply.user.id === currentUserId}
                  isCreator={reply.user.id === creatorId}
                />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Auto scroll ref */}
      <div ref={messagesEndRef} />
    </div>
  );
};
