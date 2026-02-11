"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, Clock, ArrowUpRight } from "lucide-react";
import { useParams } from "next/navigation";

export default function CourseCard({
  course,
  index,
}: {
  course: any;
  index: number;
}) {
  const params = useParams();
  // On récupère la locale, par défaut 'fr'
  const locale = params?.locale || "fr";

  // IMPORTANT: L'URL doit inclure la locale pour correspondre à ta structure app/[locale]/...
  const courseUrl = `/${locale}/courses/${course.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -15 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full transition-all duration-500"
    >
      <Link
        href={courseUrl}
        className="relative h-60 w-full overflow-hidden block"
      >
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-6 left-6 bg-[#FFB74D] text-[#004D40] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg z-10">
          Certifiant
        </span>
      </Link>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-4">
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
            <Clock size={14} className="text-[#004D40]" /> {course.duration}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-lg">
            <Star size={14} className="text-yellow-500 fill-yellow-500" />{" "}
            {course.rating}
          </span>
        </div>

        <Link href={courseUrl}>
          <h3 className="text-2xl font-bold text-[#004D40] mb-4 leading-tight group-hover:text-[#FFB74D] transition-colors cursor-pointer">
            {course.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-grow">
          Maîtrisez les codes du secteur et devenez un acteur clé de
          l&apos;industrie touristique.
        </p>

        <Link href={courseUrl} className="mt-auto">
          <motion.button
            whileHover={{ gap: "12px", scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#004D40] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 group-hover:bg-[#005d4d] transition-all shadow-lg shadow-emerald-900/10"
          >
            En savoir plus <ArrowUpRight size={18} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
