"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";

export default function SubscriptionStatus({
  status,
  planName,
  nextBillingDate,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #004D40 0%, #008080 100%)",
      }}
    >
      {/* Cercles décoratifs animés */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <CheckCircle size={32} className="text-white" />
          </div>
          <div>
            <p className="text-white/70 text-sm font-bold uppercase tracking-widest">
              Statut du compte
            </p>
            <h2 className="text-3xl font-black">Plan {planName}</h2>
          </div>
        </div>

        <div className="bg-black/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-4">
          <Clock className="text-white/60" />
          <div>
            <p className="text-xs text-white/60 font-medium uppercase">
              Prochain prélèvement
            </p>
            <p className="text-lg font-bold">{nextBillingDate}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
