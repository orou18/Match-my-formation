"use client";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function PricingHero() {
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image avec Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/hero-pricing-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-[#004D40]/70 mix-blend-multiply" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-4 max-w-4xl"
      >
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
          Investissez dans votre avenir de{" "}
          <span className="text-[#F5B743]">guide touristique</span>
        </h1>
        <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto">
          Rejoignez la plus grande communauté de professionnels du tourisme en
          Afrique et accédez à des ressources exclusives pour booster votre
          carrière.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-[#F5B743] text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-[#E5A733] transition-all">
            Démarrer maintenant
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2">
            Voir les offres <ChevronDown size={20} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
