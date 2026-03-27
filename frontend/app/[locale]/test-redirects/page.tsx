"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import UserIdManager from "@/lib/user-id-manager";

export default function TestRedirectsPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Vérifier l'état actuel
    const isAuthenticated = UserIdManager.isAuthenticated();
    const userData = UserIdManager.getStoredUserData();

    setTestResults((prev) => [
      ...prev,
      `🔍 État actuel: ${isAuthenticated ? "Connecté" : "Non connecté"}`,
    ]);
    if (userData) {
      setTestResults((prev) => [
        ...prev,
        `👤 Utilisateur: ${userData.name} (${userData.email}) - Rôle: ${userData.role}`,
      ]);
    }

    // Test 2: Tester la déconnexion
    setTestResults((prev) => [...prev, `🚪 Test de déconnexion...`]);
    UserIdManager.logout();
    setTestResults((prev) => [...prev, `✅ Déconnexion effectuée`]);

    // Test 3: Vérifier l'état après déconnexion
    const isStillAuthenticated = UserIdManager.isAuthenticated();
    setTestResults((prev) => [
      ...prev,
      `🔍 État après déconnexion: ${isStillAuthenticated ? "Encore connecté ❌" : "Non connecté ✅"}`,
    ]);

    // Test 4: Simuler les redirections de dashboards
    setTestResults((prev) => [...prev, `📋 Test des redirections attendues:`]);
    setTestResults((prev) => [
      ...prev,
      `• Dashboard admin → /${locale}/login (si non connecté)`,
    ]);
    setTestResults((prev) => [
      ...prev,
      `• Dashboard creator → /${locale}/login (si non connecté)`,
    ]);
    setTestResults((prev) => [
      ...prev,
      `• Dashboard student → /${locale}/login (si non connecté)`,
    ]);
    setTestResults((prev) => [
      ...prev,
      `• Déconnexion → /${locale} (landing page)`,
    ]);

    setIsRunning(false);
  };

  const testDashboardAccess = (dashboard: string) => {
    setTestResults((prev) => [
      ...prev,
      `🔗 Test d'accès au dashboard ${dashboard}...`,
    ]);
    router.push(`/${locale}/dashboard/${dashboard}`);
  };

  const testLogout = () => {
    setTestResults((prev) => [
      ...prev,
      `🚪 Test de déconnexion vers landing page...`,
    ]);
    UserIdManager.logout();
    setTimeout(() => {
      window.location.href = `/${locale}`;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Test des Redirections
        </h1>

        <div className="bg-gray-100 rounded-lg p-6 mb-6 max-h-64 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Résultats des Tests:</h2>
          <div className="space-y-2">
            {testResults.length === 0 ? (
              <p className="text-gray-500">
                Cliquez sur "Exécuter les tests" pour commencer
              </p>
            ) : (
              testResults.map((result, index) => (
                <p key={index} className="text-sm font-mono">
                  {result}
                </p>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Tests Automatisés:</h3>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {isRunning ? "Tests en cours..." : "Exécuter les tests"}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tests Manuels:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => testDashboardAccess("admin")}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Accès Dashboard Admin
              </button>
              <button
                onClick={() => testDashboardAccess("creator")}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Accès Dashboard Creator
              </button>
              <button
                onClick={() => testDashboardAccess("student")}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Accès Dashboard Student
              </button>
              <button
                onClick={testLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Test Déconnexion
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => router.push(`/${locale}/login`)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Page de Connexion
            </button>
            <button
              onClick={() => router.push(`/${locale}`)}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              Landing Page
            </button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Comportement attendu:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Les dashboards doivent rediriger vers login si non connecté</li>
            <li>La déconnexion doit rediriger vers la landing page</li>
            <li>Le dashboard admin nécessite le rôle "admin"</li>
            <li>La landing page doit être accessible sans authentification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
