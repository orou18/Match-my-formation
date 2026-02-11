"use client";
import { motion } from "framer-motion";
import { Check, Star, Zap, Crown, Gem, ShieldCheck } from "lucide-react";

const plans = [
  {
    title: "Achat unique",
    price: "149 €",
    sub: "Accès à vie",
    features: [
      "Accès illimité au cours",
      "Ressources téléchargeables",
      "Quiz & certification",
      "Accès offline",
    ],
    buttonText: "Payer ce cours",
    bgColor: "bg-[#F0F9F9]", // Bleu/Vert très clair
    icon: <Zap className="text-[#39A89E]" />,
    btnColor: "bg-[#F5B743] hover:bg-[#E5A733]",
    footerText: "Paiement sécurisé — Accès immédiat",
  },
  {
    title: "Abonnement Mensuel",
    price: "29 €",
    sub: "/mois",
    features: [
      "Accès à toutes les formations touristiques",
      "Nouveau contenu chaque mois",
      "Sessions live avec experts",
      "Ressources premium (cartes, guides PDF)",
      "Certifications illimitées",
      "Communauté privée de guides",
      "Priorité support",
    ],
    buttonText: "S'abonner maintenant",
    bgColor: "bg-[#FFF9F0]", // Orange/Jaune très clair
    icon: <Crown className="text-[#F5B743]" />,
    btnColor: "bg-[#F5B743] hover:bg-[#E5A733]",
    recommended: true,
    badgeText: "Recommandé",
    footerText: "Sans engagement — Résiliable à tout moment",
  },
  {
    title: "Abonnement Annuel",
    price: "249 €",
    sub: "/an",
    features: [
      "Tous les avantages du mensuel",
      "Coaching trimestriel",
      'Pack "Itinéraires & cartes pro"',
      "Accès prioritaire aux nouveautés",
    ],
    buttonText: "Choisir l'abonnement annuel",
    bgColor: "bg-[#F4F7F7]", // Gris/Bleu très clair
    icon: <Gem className="text-[#39A89E]" />,
    btnColor: "bg-[#289B8E] hover:bg-[#1E7D73]",
    badgeText: "Économisez 30%",
    footerText: "Meilleure économie sur l'année",
  },
];

export default function PricingCards({ onSelect }: { onSelect: () => void }) {
  return (
    <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-16 items-start">
      {plans.map((plan, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`relative rounded-[40px] p-8 border border-gray-100 shadow-xl flex flex-col h-full transition-all ${
            plan.recommended ? "ring-2 ring-[#F5B743] scale-105 z-20" : "z-10"
          } ${plan.bgColor}`}
        >
          {plan.badgeText && (
            <div
              className={`absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full text-xs font-bold text-white shadow-lg ${
                plan.recommended ? "bg-[#F5B743]" : "bg-[#289B8E]"
              }`}
            >
              {plan.badgeText}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white rounded-2xl shadow-sm">
              {plan.icon}
            </div>
            <h3 className="font-bold text-xl text-[#004D40]">{plan.title}</h3>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black text-[#004D40]">
                {plan.price}
              </span>
              <span className="text-gray-500 font-medium">{plan.sub}</span>
            </div>
            {plan.title === "Abonnement Annuel" && (
              <p className="text-sm text-gray-400 mt-1 italic">
                Soit 20,75€/mois
              </p>
            )}
            {plan.title === "Abonnement Mensuel" && (
              <p className="text-sm text-gray-400 mt-1">Accès illimité</p>
            )}
            {plan.title === "Achat unique" && (
              <p className="text-sm text-gray-400 mt-1">Accès à vie</p>
            )}
          </div>

          <ul className="space-y-4 mb-12 flex-grow">
            {plan.features.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-sm text-[#004D40]/80"
              >
                {plan.recommended ? (
                  <Star
                    size={18}
                    className="text-[#F5B743] shrink-0 fill-[#F5B743]"
                  />
                ) : (
                  <Check
                    size={18}
                    className={`${plan.title === "Abonnement Annuel" ? "text-[#F5B743]" : "text-[#289B8E]"} shrink-0`}
                  />
                )}
                <span className="font-medium leading-tight">{feat}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <button
              onClick={onSelect}
              className={`w-full py-5 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg mb-4 ${plan.btnColor}`}
            >
              {plan.buttonText}
            </button>
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-wider">
              {plan.title === "Achat unique" ? (
                <ShieldCheck size={14} />
              ) : i === 2 ? (
                "🐢"
              ) : (
                ""
              )}
              {plan.footerText}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
