"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline">(
    "checking"
  );
  const [message, setMessage] = useState<string>(
    "Vérification de la connexion..."
  );

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const response = await fetch(`${backendUrl}/api/health`, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: AbortSignal.timeout(5000), // Timeout après 5 secondes
        });

        if (response.ok) {
          setStatus("online");
          setMessage("Backend Laravel connecté et fonctionnel");
        } else {
          setStatus("offline");
          setMessage(`Backend répond avec le statut: ${response.status}`);
        }
      } catch (error: any) {
        setStatus("offline");
        if (error.name === "AbortError") {
          setMessage("Timeout: Le backend ne répond pas dans les 5 secondes");
        } else if (error.message.includes("fetch")) {
          setMessage("Impossible de se connecter au backend Laravel");
        } else {
          setMessage(`Erreur: ${error.message}`);
        }
      }
    };

    checkBackend();

    // Vérifier toutes les 30 secondes
    const interval = setInterval(checkBackend, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "text-green-600 bg-green-50 border-green-200";
      case "offline":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <CheckCircle size={20} className="text-green-600" />;
      case "offline":
        return <XCircle size={20} className="text-red-600" />;
      default:
        return <Loader2 size={20} className="text-yellow-600 animate-spin" />;
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 p-3 rounded-lg border ${getStatusColor()} backdrop-blur-sm`}
    >
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <div className="text-sm font-medium">
          <div className="font-semibold">
            {status === "online"
              ? "✅ Backend en ligne"
              : status === "offline"
                ? "❌ Backend hors ligne"
                : "🔄 Vérification..."}
          </div>
          <div className="text-xs opacity-75">{message}</div>
        </div>
      </div>
    </div>
  );
}
