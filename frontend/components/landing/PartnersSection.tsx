"use client";

import { motion } from "framer-motion";
import {
  Users,
  BarChart3,
  Star,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";

// --- Données Mockées ---
const PARTNERS = [
  { name: "SOFITEL", location: "Cotonou", logo: "/sofitel.jpg" },
  { name: "MARINA", location: "Hotel", logo: "/marina.jpg" },
  { name: "TRAVEL", location: "Agency", logo: "/travel.jpg" },
  { name: "HOSPITALITY", location: "Group", logo: "/group.jpg" },
];

const STATS = [
  {
    label: "Entreprises Partenaires",
    value: "50+",
    color: "from-blue-500 to-cyan-400",
    icon: Building2,
  },
  {
    label: "Employés Formés",
    value: "2,500+",
    color: "from-emerald-500 to-teal-400",
    icon: Users,
  },
  {
    label: "Taux de Satisfaction",
    value: "98%",
    color: "from-purple-600 to-pink-500",
    icon: Star,
  },
];

export default function PartnersSection() {
  return (
    <section className="relative py-24 bg-[#FDFDFD] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,122,122,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Users size={14} /> Partenariats
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-secondary mb-6"
          >
            Nos Partenaires de Formation
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl mx-auto text-bodyText text-lg leading-relaxed opacity-80"
          >
            Des acteurs majeurs de l&apos;hôtellerie et du tourisme nous font
            confiance pour former leurs équipes et développer l&apos;excellence
            de leurs services.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl border border-white p-12 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] mb-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            {PARTNERS.map((partner, i) => (
              <motion.div
                key={partner.name}
                whileHover={{ y: -5, opacity: 1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-12 w-full relative mb-2">
                  <span className="text-2xl font-black tracking-tighter text-secondary/40 group-hover:text-secondary transition-colors">
                    {partner.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-bodyText/40 uppercase tracking-widest">
                  {partner.location}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`relative overflow-hidden p-10 rounded-[2.5rem] bg-gradient-to-br ${stat.color} text-white shadow-2xl group`}
            >
              <stat.icon className="absolute -right-4 -top-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
              <div className="relative z-10">
                <h3 className="text-5xl font-black mb-2 tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-white/80 font-bold uppercase text-xs tracking-widest">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="relative bg-secondary rounded-[3rem] p-10 md:p-20 overflow-hidden shadow-2xl"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full animate-pulse" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-md border border-white/10">
              <Building2 className="text-primary" size={32} />
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
              Vous êtes une entreprise ?
            </h3>
            <p className="max-w-2xl text-white/60 text-lg mb-10">
              Rejoignez nos partenaires et offrez à vos équipes une formation
              d&apos;excellence dans le tourisme et l&apos;hôtellerie.
            </p>

            <Link
              href="/enterprise"
              className="group relative bg-primary text-white px-10 py-5 rounded-2xl font-black text-lg overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(0,122,122,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-3">
                Accédez à l&apos;Espace Partenaire{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-4xl border-t border-white/10 pt-10">
              {[
                "Formations personnalisées",
                "Suivi en temps réel",
                "Tarifs préférentiels",
              ].map((text) => (
                <div
                  key={text}
                  className="flex items-center justify-center gap-2 text-white/80 font-bold text-sm"
                >
                  <CheckCircle2 size={18} className="text-primary" /> {text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="mt-16 bg-white border border-gray-100 p-8 rounded-[2rem] shadow-xl flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto border-b-4 border-b-primary"
        >
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src="/temoignage.png"
              alt="Jean-Baptiste"
              fill
              className="rounded-2xl object-cover shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-accent p-1.5 rounded-lg text-white font-bold text-[10px]">
              5.0
            </div>
          </div>
          <div>
            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-accent text-accent" />
              ))}
            </div>
            <p className="text-secondary/80 italic font-medium leading-relaxed mb-4">
              &quot;MatchMyGuide a transformé la qualité de nos services. Nos
              équipes sont désormais mieux formées et plus confiantes dans leur
              interaction avec nos clients internationaux.&quot;
            </p>
            <div className="flex flex-col">
              <span className="font-black text-secondary uppercase tracking-tight">
                Jeanne Kouassi
              </span>
              <span className="text-xs font-bold text-primary">
                Chargé responsable - Sofitel Cotonou
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import Link from "next/link";
