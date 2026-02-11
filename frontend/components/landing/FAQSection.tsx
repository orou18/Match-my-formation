"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "Comment fonctionnent les formations ?",
    answer:
      "Nos formations sont 100% en ligne, combinant vidéos HD, quiz interactifs et ressources téléchargeables. Vous apprenez à votre rythme, sans pression.",
    category: "Général",
  },
  {
    question: "Les certifications sont-elles reconnues ?",
    answer:
      "Oui, chaque parcours validé délivre une certification officielle reconnue par les acteurs majeurs du tourisme et de l'hôtellerie partenaires.",
    category: "Diplôme",
  },
  {
    question: "Puis-je accéder aux cours sur mobile ?",
    answer:
      "Absolument. Notre plateforme est optimisée pour tous les supports : smartphone, tablette et ordinateur pour une flexibilité totale.",
    category: "Technique",
  },
  {
    question: "Quel accompagnement proposez-vous ?",
    answer:
      "Vous bénéficiez d'un support dédié et d'un accès à une communauté d'experts pour répondre à toutes vos questions durant votre apprentissage.",
    category: "Support",
  },
];

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="relative py-20 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <HelpCircle size={14} /> Centre d&apos;aide
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-secondary tracking-tighter mb-4"
          >
            Des réponses à vos{" "}
            <span className="text-primary italic">Ambitions</span>
          </motion.h2>
          <p className="text-bodyText/60 text-sm md:text-base">
            Tout ce qu&apos;il faut savoir pour lancer votre nouvelle carrière.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`group rounded-[2rem] border transition-all duration-500 ${
                activeIndex === index
                  ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/5"
                  : "border-gray-100 bg-white hover:border-primary/30"
              }`}
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-primary/50 uppercase tracking-tighter">
                    {faq.category}
                  </span>
                  <span
                    className={`text-lg font-bold transition-colors ${activeIndex === index ? "text-primary" : "text-secondary"}`}
                  >
                    {faq.question}
                  </span>
                </div>
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    activeIndex === index
                      ? "bg-primary text-white rotate-0"
                      : "bg-gray-50 text-secondary rotate-90"
                  }`}
                >
                  {activeIndex === index ? (
                    <Minus size={20} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8 text-bodyText/70 leading-relaxed border-t border-primary/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-16 p-8 rounded-[2.5rem] bg-secondary text-white relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <MessageCircle className="text-primary" size={28} />
              </div>
              <div>
                <h4 className="text-xl font-bold">Encore une hésitation ?</h4>
                <p className="text-white/50 text-sm">
                  Nos experts sont disponibles pour un échange personnalisé.
                </p>
              </div>
            </div>

            <Link
              href="/login"
              className="px-8 py-4 bg-primary text-white rounded-full font-bold flex items-center gap-2 hover:bg-white hover:text-secondary transition-all shadow-lg shadow-primary/20"
            >
              Démarrer maintenant
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
