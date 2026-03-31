"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { MessageCircle, X } from "lucide-react";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

interface ChatContainerProps {
  videoId: number;
  creatorId?: number;
  onClose?: () => void;
  isOpen?: boolean;
}

type SessionUser = {
  id?: string | number;
  accessToken?: string;
};

export const ChatContainer: React.FC<ChatContainerProps> = ({
  videoId,
  creatorId,
  onClose,
  isOpen = true,
}) => {
  const { data: session } = useSession();
  const sessionUser = (session?.user as SessionUser | undefined) || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const currentUserId =
    typeof sessionUser.id === "number"
      ? sessionUser.id
      : typeof sessionUser.id === "string"
        ? Number(sessionUser.id)
        : undefined;
  const accessToken =
    sessionUser.accessToken ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem("token") ||
        window.localStorage.getItem("auth_token")
      : null);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE_URL}/api/videos/${videoId}/messages`,
        {
          headers: accessToken
            ? {
                Authorization: `Bearer ${accessToken}`,
              }
            : {},
        }
      );

      setMessages(response.data.data || []);
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      setError("Erreur lors du chargement des messages");
    } finally {
      setIsLoading(false);
    }
  }, [videoId, accessToken]);

  // Initial load and polling
  useEffect(() => {
    fetchMessages();

    // Poll every 3 seconds for new messages
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Handle send message
  const handleSendMessage = useCallback(
    async (message: string, isQuestion: boolean) => {
      if (!accessToken) {
        setError("Vous devez être connecté pour envoyer un message");
        return;
      }

      try {
        setIsSending(true);
        setError("");

        if (replyingTo) {
          // Send reply
          const response = await axios.post(
            `${API_BASE_URL}/api/creator/chat/messages/${replyingTo}/reply`,
            { message },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // Refresh messages
          await fetchMessages();
          setReplyingTo(null);
        } else {
          // Send new message
          const response = await axios.post(
            `${API_BASE_URL}/api/videos/${videoId}/messages`,
            {
              message,
              is_question: isQuestion,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          // Add new message to list
          setMessages((prev) => [response.data.data, ...prev]);
        }
      } catch (err: any) {
        console.error("Error sending message:", err);
        setError(
          err.response?.data?.message || "Erreur lors de l'envoi du message"
        );
      } finally {
        setIsSending(false);
      }
    },
    [videoId, accessToken, replyingTo, fetchMessages]
  );

  // Handle delete message
  const handleDeleteMessage = useCallback(
    async (messageId: number) => {
      if (!accessToken) return;

      try {
        await axios.delete(`${API_BASE_URL}/api/messages/${messageId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      } catch (err: any) {
        console.error("Error deleting message:", err);
        setError("Erreur lors de la suppression du message");
      }
    },
    [accessToken]
  );

  // Handle like message
  const handleLikeMessage = useCallback(
    async (messageId: number) => {
      if (!accessToken) {
        setError("Vous devez être connecté pour liker un message");
        return;
      }

      try {
        await axios.post(
          `${API_BASE_URL}/api/messages/${messageId}/like`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Update likes count locally
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, likes_count: msg.likes_count + 1 }
              : msg
          )
        );
      } catch (err: any) {
        console.error("Error liking message:", err);
      }
    },
    [accessToken]
  );

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={20} />
          <h2 className="font-semibold">Questions & Discussions</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-100 border-b border-red-300 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Messages Area */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        creatorId={creatorId}
        currentUserId={
          Number.isFinite(currentUserId) ? currentUserId : undefined
        }
        onDeleteMessage={handleDeleteMessage}
        onLikeMessage={handleLikeMessage}
        onReplyClick={setReplyingTo}
      />

      {/* Reply Warning */}
      {replyingTo && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 flex items-center justify-between">
          <span className="text-sm text-blue-700">
            ↪️ Vous répondez à une question...
          </span>
          <button
            onClick={() => setReplyingTo(null)}
            className="text-blue-600 hover:text-blue-800 text-xs underline"
          >
            Annuler
          </button>
        </div>
      )}

      {/* Input Area */}
      {session ? (
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isSending}
          disabled={!session.user}
        />
      ) : (
        <div className="border-t border-gray-200 p-4 bg-gray-50 text-center text-sm text-gray-600">
          Connectez-vous pour participer aux discussions
        </div>
      )}
    </div>
  );
};
