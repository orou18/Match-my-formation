"use client";
import { Check, X, Star } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { name: "Accès à 1 seule formation", a: true, b: false, c: false },
  { name: "Accès à toutes les formations", a: false, b: true, c: true },
  { name: "Sessions live avec experts", a: false, b: true, c: true },
  { name: "Certificats illimités", a: false, b: true, c: true },
  { name: "Ressources premium", a: true, b: true, c: true },
  { name: "Mise à jour continue", a: false, b: true, c: true },
  { name: "Support prioritaire", a: false, b: true, c: true },
  { name: "Accès hors-ligne", a: true, b: true, c: true },
  { name: "Accès communauté touristique", a: false, b: true, c: true },
  { name: "Coaching trimestriel", a: false, b: false, c: "star" },
];

export default function ComparisonTable() {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#004D40] mb-4">
            Pourquoi choisir l&apos;abonnement ?
          </h2>
          <p className="text-gray-500 font-medium">
            Comparez les avantages de chaque formule
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[40px] border border-gray-100 shadow-2xl"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-white text-sm font-bold uppercase tracking-wider">
                <th className="p-8 text-left bg-[#004D40]">Fonctionnalités</th>
                <th className="p-8 text-center bg-[#1E6B64]">Achat unique</th>
                <th className="p-8 text-center bg-[#F5B743]">
                  Abonnement Mensuel
                </th>
                <th className="p-8 text-center bg-[#004D40]">
                  Abonnement Annuel
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {features.map((f, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition-colors group text-[#004D40]"
                >
                  <td className="p-6 font-semibold text-sm">{f.name}</td>

                  {/* Colonne Achat Unique */}
                  <td className="p-6 text-center">
                    {f.a === true ? (
                      <Check className="mx-auto text-[#F5B743]" size={20} />
                    ) : (
                      <X className="mx-auto text-gray-300" size={18} />
                    )}
                  </td>

                  {/* Colonne Mensuel (Mise en avant) */}
                  <td className="p-6 text-center bg-orange-50/20">
                    {f.b === true ? (
                      <Check className="mx-auto text-[#F5B743]" size={20} />
                    ) : (
                      <X className="mx-auto text-gray-300" size={18} />
                    )}
                  </td>

                  {/* Colonne Annuel */}
                  <td className="p-6 text-center">
                    {f.c === true ? (
                      <Check className="mx-auto text-[#289B8E]" size={20} />
                    ) : f.c === "star" ? (
                      <Star
                        className="mx-auto text-[#F5B743] fill-[#F5B743]"
                        size={20}
                      />
                    ) : (
                      <X className="mx-auto text-gray-300" size={18} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
