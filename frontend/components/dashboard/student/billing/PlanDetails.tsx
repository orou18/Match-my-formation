"use client";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function PlanDetails({ features }: { features: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm"
    >
      <h3 className="text-xl font-black text-[#002B24] mb-6 tracking-tight">
        Inclus dans votre offre
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
          >
            <ShieldCheck size={18} className="text-primary" />
            <span className="text-sm font-bold text-gray-600">{feature}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
