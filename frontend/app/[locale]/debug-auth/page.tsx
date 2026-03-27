"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import UserIdManager from "@/lib/user-id-manager";

export default function DebugAuthPage() {
  const [localStorageData, setLocalStorageData] = useState<{
    [key: string]: string;
  }>({});
  const [authStatus, setAuthStatus] = useState<string>("");
  const params = useParams();
  const locale = params.locale || "fr";

  useEffect(() => {
    // Récupérer toutes les données du localStorage
    const data: { [key: string]: string } = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        data[key] = localStorage.getItem(key) || "";
      }
    }
    setLocalStorageData(data);

    // Vérifier le statut d'authentification
    const isAuthenticated = UserIdManager.isAuthenticated();
    const userData = UserIdManager.getStoredUserData();

    setAuthStatus(`
      Authentifié: ${isAuthenticated}
      Données utilisateur: ${userData ? JSON.stringify(userData, null, 2) : "Aucune"}
    `);
  }, []);

  const handleForceClean = () => {
    UserIdManager.logout();
    // Nettoyage supplémentaire si nécessaire
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    window.location.reload();
  };

  const handleLogout = () => {
    UserIdManager.logout();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Authentification</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Statut d'authentification */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Statut Authentification
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
              {authStatus}
            </pre>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Déconnexion normale
              </button>
              <button
                onClick={handleForceClean}
                className="w-full py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Nettoyage forcé complet
              </button>
              <a
                href={`/${locale}/login`}
                className="block w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center"
              >
                Aller à la page de connexion
              </a>
            </div>
          </div>

          {/* localStorage complet */}
          <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">LocalStorage Complet</h2>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
