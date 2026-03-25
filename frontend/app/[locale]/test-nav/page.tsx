"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowRight, TestTube, AlertCircle } from "lucide-react";

export default function TestNavigationPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testRouterNavigation = () => {
    addLog("🚀 Test de navigation avec router.push()");
    addLog(`📍 Router disponible: ${!!router}`);
    addLog(`📍 Locale: ${locale}`);
    
    const targetUrl = `/${locale}/dashboard/creator/employees/add`;
    addLog(`🔗 URL cible: ${targetUrl}`);
    
    try {
      router.push(targetUrl);
      addLog("✅ Navigation demandée avec router.push()");
    } catch (error) {
      addLog(`❌ Erreur router.push(): ${error}`);
      
      // Test fallback
      addLog("🔄 Test fallback avec window.location");
      window.location.href = targetUrl;
      addLog("✅ Navigation demandée avec window.location");
    }
  };

  const testDirectNavigation = () => {
    addLog("🧪 Test de navigation directe");
    const targetUrl = `/${locale}/dashboard/creator/employees/add`;
    addLog(`🔗 URL directe: ${targetUrl}`);
    
    window.location.href = targetUrl;
    addLog("✅ Navigation directe demandée");
  };

  const testPageAccess = async (pageName: string, path: string) => {
    addLog(`📄 Test accès page: ${pageName}`);
    
    try {
      const response = await fetch(`/${locale}${path}`, { method: 'HEAD' });
      addLog(`${response.ok ? '✅' : '❌'} ${pageName}: ${response.status}`);
    } catch (error) {
      addLog(`❌ Erreur ${pageName}: ${error}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
          <TestTube className="w-8 h-8 text-blue-600" />
          Test de Navigation
        </h1>
        
        <div className="bg-gray-100 rounded-lg p-6 mb-6 max-h-64 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Logs de Test:
          </h2>
          <div className="space-y-1">
            {logs.length === 0 ? (
              <p className="text-gray-500">Cliquez sur un test pour voir les logs</p>
            ) : (
              logs.map((log, index) => (
                <p key={index} className="text-sm font-mono">{log}</p>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Tests de Navigation:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testRouterNavigation}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Router Navigation
              </button>
              <button
                onClick={testDirectNavigation}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4" />
                Navigation Directe
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Tests d'Accessibilité:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => testPageAccess("Liste Employés", "/dashboard/creator/employees")}
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Test Liste
              </button>
              <button
                onClick={() => testPageAccess("Ajout Employé", "/dashboard/creator/employees/add")}
                className="px-4 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Test Ajout
              </button>
              <button
                onClick={() => testPageAccess("Branding", "/dashboard/creator/branding")}
                className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Test Branding
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={clearLogs}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Effacer les logs
            </button>
            
            <div className="text-sm text-gray-600">
              <p>Locale actuelle: <strong>{locale}</strong></p>
              <p>Router disponible: <strong>{!!router ? 'Oui' : 'Non'}</strong></p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Testez la navigation avec router.push()</li>
            <li>Testez la navigation directe avec window.location</li>
            <li>Vérifiez l'accessibilité des pages</li>
            <li>Consultez les logs pour diagnostiquer les problèmes</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
