"use client";

import { useState } from "react";
import { authService } from "@/lib/services/auth-service-v2";

export default function TestAuth() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testLogin = async (email: string, password: string) => {
    setLoading(true);
    setResult("");

    try {
      const response = await authService.login(email, password);
      setResult(
        `✅ Connexion réussie!\n\n${JSON.stringify(response, null, 2)}`
      );
    } catch (error: any) {
      setResult(`❌ Erreur de connexion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test d'Authentification</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">🎓 Étudiant</h2>
            <p className="text-sm text-gray-600 mb-4">student@match.com</p>
            <button
              onClick={() => testLogin("student@match.com", "Azerty123!")}
              disabled={loading}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Test..." : "Tester Étudiant"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">👨‍🏫 Formateur</h2>
            <p className="text-sm text-gray-600 mb-4">creator@match.com</p>
            <button
              onClick={() => testLogin("creator@match.com", "Azerty123!")}
              disabled={loading}
              className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Test..." : "Tester Formateur"}
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">👤 Administrateur</h2>
            <p className="text-sm text-gray-600 mb-4">admin@match.com</p>
            <button
              onClick={() => testLogin("admin@match.com", "Azerty123!")}
              disabled={loading}
              className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? "Test..." : "Tester Admin"}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Résultat</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {result}
            </pre>
          </div>
        )}

        <div className="bg-yellow-50 p-6 rounded-lg shadow mt-8">
          <h2 className="text-lg font-semibold mb-4">📋 Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Assurez-vous que le backend Laravel tourne sur{" "}
              <code>http://127.0.0.1:8000</code>
            </li>
            <li>
              Assurez-vous que le frontend tourne sur{" "}
              <code>http://localhost:3001</code>
            </li>
            <li>
              Cliquez sur un des boutons ci-dessus pour tester
              l'authentification
            </li>
            <li>Si succès, vous serez redirigé vers le dashboard approprié</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
