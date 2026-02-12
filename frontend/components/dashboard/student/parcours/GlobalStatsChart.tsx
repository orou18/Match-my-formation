"use client";
import { motion } from "framer-motion";

export default function GlobalStatsChart() {
  const stats = [
    { label: "Formations terminées", value: "12 / 18", icon: "📚", color: "bg-blue-50" },
    { label: "Temps total", value: "127h 45min", icon: "⏱️", color: "bg-orange-50" },
    { label: "Modules complétés", value: "84 / 124", icon: "💎", color: "bg-purple-50" },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col justify-between">
      <h3 className="font-black text-[#002B24] text-xl mb-8">Progression globale</h3>
      
      <div className="relative flex justify-center items-center mb-10">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100" />
          <motion.circle 
            cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={553}
            initial={{ strokeDashoffset: 553 }}
            animate={{ strokeDashoffset: 553 - (553 * 0.68) }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-4xl font-black text-[#002B24]">68%</span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Complété</p>
        </div>
      </div>

      <div className="space-y-4">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-lg shadow-sm`}>
                {stat.icon}
              </span>
              <span className="text-sm font-medium text-gray-500">{stat.label}</span>
            </div>
            <span className="font-bold text-[#002B24]">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}