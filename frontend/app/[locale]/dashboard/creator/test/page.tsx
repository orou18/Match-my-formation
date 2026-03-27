"use client";

import { motion } from "framer-motion";

export default function TestCreatorPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Test Dashboard Creator
        </h1>
        <p className="text-gray-600 mb-8">
          Si vous voyez cette page, le layout fonctionne. La sidebar devrait
          être visible.
        </p>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Contenu de test</h2>
          <p>
            Ceci est une page de test pour vérifier que le layout creator
            s'applique correctement.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
