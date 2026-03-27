"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import {
  Users,
  Plus,
  Database,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function TestEmployeesPage() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || "fr";

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Test 1: Vérifier l'API GET
    setTestResults((prev) => [...prev, `🔍 Test 1: Vérification API GET`]);
    try {
      const response = await fetch("/api/creator/employees");
      const data = await response.json();

      if (data.success) {
        setTestResults((prev) => [...prev, `   ✅ API GET fonctionnelle`]);
        setTestResults((prev) => [
          ...prev,
          `   📊 ${data.data.length} employés trouvés`,
        ]);
        setEmployees(data.data);
      } else {
        setTestResults((prev) => [
          ...prev,
          `   ❌ API GET erreur: ${data.message}`,
        ]);
      }
    } catch (error) {
      setTestResults((prev) => [...prev, `   ❌ Erreur API GET: ${error}`]);
    }

    // Test 2: Vérifier l'API POST
    setTestResults((prev) => [...prev, `\n📝 Test 2: Vérification API POST`]);
    try {
      const testEmployee = {
        name: "Test Employee " + Date.now(),
        email: `test${Date.now()}@employee.com`,
        phone: "+33 6 12 34 56 78",
        department: "Marketing",
        position: "Agent",
        role: "employee",
        password: "Azerty123!",
        hire_date: "2024-01-01",
        status: "active",
      };

      const response = await fetch("/api/creator/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer test-token`,
        },
        body: JSON.stringify(testEmployee),
      });

      const data = await response.json();

      if (data.success) {
        setTestResults((prev) => [...prev, `   ✅ API POST fonctionnelle`]);
        setTestResults((prev) => [
          ...prev,
          `   👤 Employé créé: ${data.data.name}`,
        ]);
        setTestResults((prev) => [...prev, `   📧 Email: ${data.data.email}`]);
        setTestResults((prev) => [...prev, `   🆔 ID: ${data.data.id}`]);
      } else {
        setTestResults((prev) => [
          ...prev,
          `   ❌ API POST erreur: ${data.message}`,
        ]);
      }
    } catch (error) {
      setTestResults((prev) => [...prev, `   ❌ Erreur API POST: ${error}`]);
    }

    // Test 3: Vérifier le stockage local
    setTestResults((prev) => [
      ...prev,
      `\n💾 Test 3: Vérification stockage local`,
    ]);
    try {
      const stored = localStorage.getItem("creator_employees");
      if (stored) {
        const storedEmployees = JSON.parse(stored);
        setTestResults((prev) => [...prev, `   ✅ Stockage local fonctionnel`]);
        setTestResults((prev) => [
          ...prev,
          `   📊 ${storedEmployees.length} employés stockés localement`,
        ]);
      } else {
        setTestResults((prev) => [
          ...prev,
          `   ⚠️ Aucune donnée locale trouvée`,
        ]);
      }
    } catch (error) {
      setTestResults((prev) => [
        ...prev,
        `   ❌ Erreur stockage local: ${error}`,
      ]);
    }

    // Test 4: Vérifier les pages
    setTestResults((prev) => [...prev, `\n📄 Test 4: Vérification des pages`]);
    const pages = [
      { path: "/dashboard/creator/employees", name: "Liste employés" },
      { path: "/dashboard/creator/employees/add", name: "Ajout employé" },
      { path: "/dashboard/creator/branding", name: "Branding" },
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`/${locale}${page.path}`);
        if (response.ok) {
          setTestResults((prev) => [...prev, `   ✅ ${page.name} accessible`]);
        } else {
          setTestResults((prev) => [
            ...prev,
            `   ❌ ${page.name} erreur ${response.status}`,
          ]);
        }
      } catch (error) {
        setTestResults((prev) => [
          ...prev,
          `   ❌ ${page.name} erreur: ${error}`,
        ]);
      }
    }

    setIsRunning(false);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("creator_employees");
    setTestResults((prev) => [...prev, `🗑️ Stockage local vidé`]);
    setEmployees([]);
  };

  const navigateToPage = (path: string) => {
    router.push(`/${locale}${path}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          Test du Système Employés
        </h1>

        <div className="bg-gray-100 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            Résultats des Tests:
          </h2>
          <div className="space-y-1">
            {testResults.length === 0 ? (
              <p className="text-gray-500">
                Cliquez sur "Exécuter les tests" pour commencer
              </p>
            ) : (
              testResults.map((result, index) => (
                <p
                  key={index}
                  className="text-sm font-mono whitespace-pre-wrap"
                >
                  {result}
                </p>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Tests Automatisés:</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 flex items-center gap-2"
              >
                {isRunning ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {isRunning ? "Tests en cours..." : "Exécuter les tests"}
              </button>

              <button
                onClick={clearLocalStorage}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" />
                Vider le stockage
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Navigation Rapide:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => navigateToPage("/dashboard/creator/employees")}
                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Liste Employés
              </button>
              <button
                onClick={() =>
                  navigateToPage("/dashboard/creator/employees/add")
                }
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ajouter Employé
              </button>
              <button
                onClick={() => navigateToPage("/dashboard/creator/branding")}
                className="px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Branding
              </button>
            </div>
          </div>

          {employees.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Employés Actuels ({employees.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                <div className="space-y-2">
                  {employees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between p-2 bg-white rounded border"
                    >
                      <div>
                        <span className="font-medium">{emp.name}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {emp.email}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {emp.department} - {emp.position}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">Ce que nous testons:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>🔧 API GET pour récupérer les employés</li>
            <li>📝 API POST pour ajouter un employé</li>
            <li>💾 Stockage local avec persistance</li>
            <li>📄 Accessibilité des pages</li>
            <li>🔄 Navigation entre les pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
