"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Clock,
  BookOpen,
  Star,
  Award,
  Video,
  CheckCircle2,
  ChevronDown,
  PlayCircle,
  Users,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

export default function CourseDetailPage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Conforme image_77349e.jpg */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-[#004D40] text-white">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <Image
            src="/sofitel.jpg"
            alt="Hero"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#004D40] via-[#004D40]/80 to-transparent" />
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex gap-2 mb-6 text-[10px] font-black uppercase tracking-widest">
              <span className="bg-[#FFB74D] text-[#004D40] px-3 py-1 rounded-full">
                Best-seller Tourisme
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-full border border-white/20">
                Nouveau
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              Devenir Guide <br />{" "}
              <span className="text-[#FFB74D] italic">Touristique Pro</span>
            </h1>
            <p className="text-emerald-50/80 text-lg mb-8 max-w-xl">
              Maîtrisez les fondamentaux pour accompagner des visiteurs dans
              n&apos;importe quelle destination.
            </p>
            <div className="flex flex-wrap gap-6 mb-10">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Clock size={18} className="text-[#FFB74D]" /> 12 heures
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <BookOpen size={18} className="text-[#FFB74D]" /> 6 Modules
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                <Star size={18} className="text-[#FFB74D]" /> 4.8 (2.8k avis)
              </div>
            </div>
            <div className="flex gap-4">
              <button className="bg-[#FFB74D] text-[#004D40] px-8 py-4 rounded-full font-black text-sm uppercase shadow-xl hover:scale-105 transition-all">
                Commencer la formation - 89$
              </button>
              <button className="bg-white/10 border border-white/20 px-8 py-4 rounded-full font-black text-sm uppercase backdrop-blur-md">
                Favoris
              </button>
            </div>
          </motion.div>

          <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-8 border-white/10 shadow-2xl">
            <Image
              src="/guide2.jpg"
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <PlayCircle size={80} className="text-white opacity-80" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-20">
          {/* Objectifs - image_77349e.jpg */}
          <div>
            <h2 className="text-3xl font-black text-[#004D40] mb-8">
              Ce que vous allez apprendre
            </h2>
            <div className="grid md:grid-cols-2 gap-y-4 gap-x-12">
              {[
                "Lire une carte touristique",
                "Gérer un groupe",
                "Accueillir des touristes",
                "Expliquer l'histoire",
                "Maîtriser les règles de sécurité",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 text-[#004D40]/80 font-bold"
                >
                  <CheckCircle2
                    size={20}
                    className="text-[#FFB74D] mt-1 shrink-0"
                  />{" "}
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum - image_77349e.jpg */}
          <div>
            <h2 className="text-3xl font-black text-[#004D40] mb-8">
              Contenu du cours
            </h2>
            <div className="space-y-4">
              {[1, 2, 3].map((mod) => (
                <div
                  key={mod}
                  className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50 flex justify-between items-center group cursor-pointer hover:bg-white hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-[#004D40] text-white flex items-center justify-center font-bold text-sm">
                      {mod}
                    </span>
                    <h3 className="font-black text-[#004D40]">
                      Module {mod}: Fondamentaux du guidage
                    </h3>
                  </div>
                  <ChevronDown className="text-gray-400 group-hover:text-[#FFB74D]" />
                </div>
              ))}
            </div>
          </div>

          {/* Formateur - image_77349e.jpg */}
          <div className="bg-[#F8FAFC] p-10 rounded-[3rem] flex flex-col md:flex-row gap-8 items-center border border-gray-100">
            <div className="w-32 h-32 relative rounded-full overflow-hidden shrink-0 border-4 border-white shadow-lg">
              <Image
                src="/guide1.jpg"
                alt="Coach"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#004D40] mb-2">
                Dr. Amadou Kone
              </h3>
              <p className="text-[#FFB74D] font-bold text-sm mb-4">
                Expert patrimoine Afrique de l&apos;Ouest
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Spécialiste du patrimoine culturel avec plus de 15 ans
                d&apos;expérience. Docteur en Histoire.
              </p>
              <div className="flex gap-6 text-xs font-black text-[#004D40]/60 uppercase">
                <span className="flex items-center gap-2">
                  <Users size={16} /> 1.2k Étudiants
                </span>
                <span className="flex items-center gap-2">
                  <Star size={16} /> 4.9 Note
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Sticky */}
        <aside className="relative lg:pt-0 pt-10">
          <div className="sticky top-28 bg-[#004D40] text-white p-10 rounded-[3rem] shadow-2xl">
            <h3 className="text-xl font-black mb-8 border-b border-white/10 pb-4">
              Points forts
            </h3>
            <ul className="space-y-6 mb-10 text-sm font-bold text-white/80">
              <li className="flex items-center gap-4">
                <Award size={20} className="text-[#FFB74D]" /> Certification
                reconnue
              </li>
              <li className="flex items-center gap-4">
                <Video size={20} className="text-[#FFB74D]" /> Accès à vie
              </li>
              <li className="flex items-center gap-4">
                <Users size={20} className="text-[#FFB74D]" /> Sessions live
                avec experts
              </li>
              <li className="flex items-center gap-4">
                <GraduationCap size={20} className="text-[#FFB74D]" />{" "}
                Ressources téléchargeables
              </li>
            </ul>
            <div className="text-center pt-6 border-t border-white/10">
              <p className="text-4xl font-black text-[#FFB74D] mb-6">89 $</p>
              <button className="w-full bg-[#FFB74D] text-[#004D40] py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white transition-colors">
                S&apos;inscrire maintenant
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
