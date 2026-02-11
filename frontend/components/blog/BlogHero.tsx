"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogHero() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale || "fr";
  const [isNavigating, setIsNavigating] = useState(false);

  const handleNavigation = (href: string) => {
    setIsNavigating(true);
    router.push(href);
  };

  const scrollToPricing = () => {
    const pricingSection = document.getElementById("offers");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      setIsNavigating(true);
      router.push(`/${locale}/pricing#offers`);
    }
  };

  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-[#004D40]">
      {isNavigating && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-[60] bg-[#004D40]/20 backdrop-blur-[2px] pointer-events-none"
        />
      )}

      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#004D40]/60 via-[#004D40]/80 to-[#F8FAFB]" />
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073"
          className="w-full h-full object-cover"
          alt="Paris Background"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[#F5B743] text-xs font-black uppercase tracking-[0.3em] mb-6 inline-block">
            Le Mag MatchMyFormation
          </span>

          <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-6">
            Actualités & Conseils pour <br />
            <span className="text-[#F5B743] drop-shadow-sm">Futurs Guides</span>
          </h1>

          <p className="text-gray-200 text-base md:text-xl max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
            Élevez votre carrière. Accédez aux ressources exclusives pour
            maîtriser l&apos;art du guidage et du patrimoine.
          </p>

          <div className="flex flex-wrap justify-center gap-5">
            <Link
              href={`/${locale}/login`}
              onClick={() => setIsNavigating(true)}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-[#F5B743] text-[#004D40] font-black rounded-2xl shadow-2xl shadow-[#F5B743]/20 hover:bg-white transition-all uppercase tracking-widest text-sm"
              >
                Commencer l&apos;aventure
              </motion.button>
            </Link>

            <motion.button
              onClick={scrollToPricing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 border-2 border-white/30 backdrop-blur-md text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
            >
              Voir les plans
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#F5B743]/10 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
