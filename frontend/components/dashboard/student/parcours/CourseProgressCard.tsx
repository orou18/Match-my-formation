"use client";
import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function CourseProgressCard({
  title,
  module,
  progress,
  image,
}: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-5 items-center group transition-all hover:shadow-xl hover:shadow-primary/5"
    >
      <div className="relative w-full sm:w-40 h-28 rounded-xl overflow-hidden shadow-inner">
        <img
          src={image}
          alt={title}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      </div>

      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-[#002B24] text-lg leading-tight">
            {title}
          </h3>
          <span className="text-[10px] font-black bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase tracking-tighter">
            En cours
          </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">{module}</p>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] font-bold text-primary uppercase">
            <span>Progression</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${progress}%` }}
              className="h-full bg-primary"
            />
          </div>
        </div>
      </div>

      <button className="whitespace-nowrap px-6 py-3 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-[#003d33] transition-all flex items-center gap-2 active:scale-95">
        <PlayCircle size={18} />
        Reprendre
      </button>
    </motion.div>
  );
}
