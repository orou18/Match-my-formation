"use client";

import React, { useState } from "react";
import { Send, Loader } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string, isQuestion: boolean) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading = false,
  disabled = false,
}) => {
  const [message, setMessage] = useState("");
  const [isQuestion, setIsQuestion] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Le message ne peut pas être vide");
      return;
    }

    try {
      setError("");
      await onSend(message, isQuestion);
      setMessage("");
      setIsQuestion(false);
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'envoi du message");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 p-4 bg-white"
    >
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* Message Input */}
        <div className="flex gap-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Posez une question ou laissez un commentaire..."
            disabled={isLoading || disabled}
            className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            rows={3}
          />

          <button
            type="submit"
            disabled={isLoading || disabled || !message.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 self-end"
          >
            {isLoading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span className="hidden sm:inline">Envoyer</span>
          </button>
        </div>

        {/* Question Toggle */}
        <label className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            type="checkbox"
            checked={isQuestion}
            onChange={(e) => setIsQuestion(e.target.checked)}
            disabled={isLoading || disabled}
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-gray-700">
            📌 Marquer comme une question (visible par le creator)
          </span>
        </label>

        {/* Helper Text */}
        <p className="text-xs text-gray-500">
          💡 Conseil: Cochez "Question" pour que le creator soit notifié de
          votre question
        </p>
      </div>
    </form>
  );
};
