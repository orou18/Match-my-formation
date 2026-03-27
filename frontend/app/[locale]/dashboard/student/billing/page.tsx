"use client";
import { motion } from "framer-motion";
import SubscriptionStatus from "@/components/dashboard/student/billing/SubscriptionStatus";
import PlanDetails from "@/components/dashboard/student/billing/PlanDetails";
import PaymentHistory from "@/components/dashboard/student/billing/PaymentHistory";

const MOCK_DATA = {
  planName: "Premium Gold",
  status: "active",
  nextBillingDate: "15 Mars 2026",
  features: [
    "Accès illimité à tous les cours",
    "Mentorat personnalisé (1h/mois)",
    "Certifications certifiées par l'État",
    "Accès aux événements VIP",
  ],
  invoices: [
    { id: "INV-001", date: "15 Fév 2026", amount: "15.000", status: "paid" },
    { id: "INV-002", date: "15 Jan 2026", amount: "15.000", status: "paid" },
  ],
};

export default function BillingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFB] pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 md:px-8 py-10 space-y-10"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-[#002B24]">
            Abonnement & Facturation
          </h1>
          <p className="text-gray-500 font-medium">
            Gérez votre offre et téléchargez vos factures en toute sécurité.
          </p>
        </div>

        {/* Bloc Statut Principal */}
        <SubscriptionStatus
          planName={MOCK_DATA.planName}
          nextBillingDate={MOCK_DATA.nextBillingDate}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Détails du plan - 2 colonnes */}
          <div className="lg:col-span-2 space-y-10">
            <PlanDetails features={MOCK_DATA.features} />
            <PaymentHistory invoices={MOCK_DATA.invoices} />
          </div>

          {/* Sidebar - Actions d'abonnement */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h4 className="font-black text-[#002B24] mb-4">
                Besoin de changement ?
              </h4>
              <p className="text-sm text-gray-500 mb-6">
                Vous pouvez mettre à jour votre plan ou annuler à tout moment.
              </p>
              <div className="space-y-3">
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#003d33] transition-all">
                  Changer de plan
                </button>
                <button className="w-full py-4 bg-white text-red-500 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all">
                  Suspendre l'abonnement
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
