"use client";

import { useState, useEffect } from "react";
import PricingHero from "@/components/pricing/PricingHero";
import PricingCards from "@/components/pricing/PricingCard";
import ComparisonTable from "@/components/pricing/ComparisonTable";
import CheckoutModal from "@/components/pricing/CheckoutModal";
import SuccessOverlay from "@/components/pricing/SuccessOverlay";
import TrustSection from "@/components/pricing/TrustSection";

export default function PricingPage() {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hash === "#offers" &&
      step === 1
    ) {
      const element = document.getElementById("offers");
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, [step]);

  return (
    <main className="bg-white min-h-screen">
      {step === 1 && (
        <div className="animate-in fade-in duration-700">
          <PricingHero />

          <section id="offers" className="py-10 scroll-mt-20">
            <PricingCards onSelect={() => setStep(2)} />
          </section>

          <ComparisonTable />
          <TrustSection />
        </div>
      )}

      {/* ÉTAPE 2 : PAIEMENT */}
      {step === 2 && (
        <section className="py-20 bg-gray-50/50 min-h-screen animate-in slide-in-from-bottom-10 duration-500">
          <CheckoutModal
            isOpen={true}
            onClose={() => setStep(1)}
            onComplete={() => setStep(3)}
          />
          <button
            onClick={() => setStep(1)}
            className="block mx-auto mt-8 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-[#004D40] transition-colors"
          >
            ← Retour aux offres
          </button>
        </section>
      )}

      {step === 3 && (
        <div className="animate-in zoom-in-95 duration-500 h-screen flex items-center justify-center">
          <SuccessOverlay isOpen={true} />
        </div>
      )}
    </main>
  );
}
