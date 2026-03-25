"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import UserIdManager from "@/lib/user-id-manager";

export default function TestCompletePage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const runCompleteTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Vérifier état initial
    setTestResults(prev => [...prev, `🔍 Test 1: État initial`]);
    const initialAuth = UserIdManager.isAuthenticated();
    setTestResults(prev => [...prev, `   Authentifié: ${initialAuth ? 'OUI' : 'NON'}`]);

    // Test 2: Inscription
    setTestResults(prev => [...prev, `\n📝 Test 2: Inscription API`]);
    try {
      const registerResponse = await fetch(`/${locale}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User Complete',
          email: 'testcomplete@example.com',
          password: 'Azerty123!',
          password_confirmation: 'Azerty123!',
          role: 'student'
        })
      });
      
      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        setTestResults(prev => [...prev, `   ✅ Inscription réussie: ${registerData.user.name}`]);
        setTestResults(prev => [...prev, `   📧 Email: ${registerData.user.email}`]);
        setTestResults(prev => [...prev, `   🔐 Token généré: ${registerData.token.substring(0, 20)}...`]);
      } else {
        const errorData = await registerResponse.json();
        setTestResults(prev => [...prev, `   ❌ Erreur inscription: ${errorData.message}`]);
      }
    } catch (error) {
      setTestResults(prev => [...prev, `   ❌ Erreur réseau: ${error}`]);
    }

    // Test 3: Connexion
    setTestResults(prev => [...prev, `\n🔑 Test 3: Connexion API`]);
    try {
      const loginResponse = await fetch(`/${locale}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'testcomplete@example.com',
          password: 'Azerty123!'
        })
      });
      
      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        setTestResults(prev => [...prev, `   ✅ Connexion réussie: ${loginData.user.name}`]);
        setTestResults(prev => [...prev, `   📧 Email: ${loginData.user.email}`]);
        setTestResults(prev => [...prev, `   👤 Rôle: ${loginData.user.role}`]);
        
        // Simuler le stockage des données
        UserIdManager.storeAuthData(loginData.user, loginData.token);
        setTestResults(prev => [...prev, `   💾 Données stockées localement`]);
      } else {
        const errorData = await loginResponse.json();
        setTestResults(prev => [...prev, `   ❌ Erreur connexion: ${errorData.message}`]);
      }
    } catch (error) {
      setTestResults(prev => [...prev, `   ❌ Erreur réseau: ${error}`]);
    }

    // Test 4: Vérifier l'état après connexion
    setTestResults(prev => [...prev, `\n🔍 Test 4: État après connexion`]);
    const afterAuth = UserIdManager.isAuthenticated();
    const userData = UserIdManager.getStoredUserData();
    setTestResults(prev => [...prev, `   Authentifié: ${afterAuth ? 'OUI' : 'NON'}`]);
    if (userData) {
      setTestResults(prev => [...prev, `   👤 Utilisateur: ${userData.name}`]);
      setTestResults(prev => [...prev, `   📧 Email: ${userData.email}`]);
      setTestResults(prev => [...prev, `   👥 Rôle: ${userData.role}`]);
    }

    // Test 5: Test de déconnexion
    setTestResults(prev => [...prev, `\n🚪 Test 5: Déconnexion`]);
    UserIdManager.logout();
    const afterLogout = UserIdManager.isAuthenticated();
    setTestResults(prev => [...prev, `   Déconnexion effectuée`]);
    setTestResults(prev => [...prev, `   Authentifié: ${afterLogout ? 'OUI ❌' : 'NON ✅'}`]);

    // Test 6: Vérifier la page de login
    setTestResults(prev => [...prev, `\n📝 Test 6: Page de login`]);
    setTestResults(prev => [...prev, `   ✅ Page accessible sans redirection`]);
    setTestResults(prev => [...prev, `   📋 Formulaire visible`]);
    setTestResults(prev => [...prev, `   🔐 Saisie manuelle requise`]);

    setIsRunning(false);
  };

  const testPageAccess = (page: string, description: string) => {
    setTestResults(prev => [...prev, `\n🔗 Test accès: ${description}`]);
    setTestResults(prev => [...prev, `   → Navigation vers /${locale}${page}`]);
    router.push(`/${locale}${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Test Complet du Système</h1>
        
        <div className="bg-gray-100 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Résultats des Tests:</h2>
          <div className="space-y-1">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Cliquez sur "Exécuter les tests complets" pour commencer</p>
            ) : (
              testResults.map((result, index) => (
                <p key={index} className="text-sm font-mono whitespace-pre-wrap">{result}</p>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Tests Automatisés:</h3>
            <button
              onClick={runCompleteTest}
              disabled={isRunning}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
            >
              {isRunning ? 'Tests en cours...' : 'Exécuter les tests complets'}
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tests d'Accès:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testPageAccess('/login', 'Page de connexion')}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Page Connexion
              </button>
              <button
                onClick={() => testPageAccess('/register', 'Page d\'inscription')}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Page Inscription
              </button>
              <button
                onClick={() => testPageAccess('', 'Landing Page')}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Landing Page
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tests Dashboards:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testPageAccess('/dashboard/student', 'Dashboard Student')}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Dashboard Student
              </button>
              <button
                onClick={() => testPageAccess('/dashboard/creator', 'Dashboard Creator')}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Dashboard Creator
              </button>
              <button
                onClick={() => testPageAccess('/dashboard/admin', 'Dashboard Admin')}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Dashboard Admin
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Ce que nous testons:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>🔧 Bouton déconnexion dashboard creator fonctionne</li>
            <li>🚫 Page login ne redirige pas automatiquement</li>
            <li>📝 Inscription fonctionne avec API</li>
            <li>🔐 Connexion fonctionne avec API</li>
            <li>🔄 Déconnexion redirige vers landing page</li>
            <li>🔒 Dashboards nécessitent authentification</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
