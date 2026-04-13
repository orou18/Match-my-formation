"use client";
import { motion } from "framer-motion";

interface GlobalStatsChartProps {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHours: number;
  completedHours: number;
  averageScore: number;
  streak: number;
  rank: number;
  totalStudents: number;
}

export default function GlobalStatsChart({
  totalCourses,
  completedCourses,
  inProgressCourses,
  totalHours,
  completedHours,
  averageScore,
  streak,
  rank,
  totalStudents,
}: GlobalStatsChartProps) {
  const progressPercentage = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;
  
  const stats = [
    {
      label: "Formations terminées",
      value: `${completedCourses} / ${totalCourses}`,
      icon: "📚",
      color: "bg-blue-50",
    },
    {
      label: "Temps total",
      value: `${Math.floor(completedHours / 60)}h ${completedHours % 60}min`,
      icon: "⏱️",
      color: "bg-orange-50",
    },
    {
      label: "Modules complétés",
      value: `${Math.round(progressPercentage * 1.24)} / ${totalCourses * 1.24}`,
      icon: "💎",
      color: "bg-purple-50",
    },
  ];

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-full flex flex-col justify-between">
      <h3 className="font-black text-[#002B24] text-xl mb-8">
        Progression globale
      </h3>

      <div className="relative flex justify-center items-center mb-10">
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-gray-100"
          />
          <motion.circle
            cx="96"
            cy="96"
            r="88"
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={553}
            initial={{ strokeDashoffset: 553 }}
            animate={{ strokeDashoffset: 553 - 553 * (progressPercentage / 100) }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="text-primary"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-4xl font-black text-[#002B24]">
            {Math.round(progressPercentage)}%
          </span>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Complété
          </p>
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
              <span
                className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-lg shadow-sm`}
              >
                {stat.icon}
              </span>
              <span className="text-sm font-medium text-gray-500">
                {stat.label}
              </span>
            </div>
            <span className="font-bold text-[#002B24]">{stat.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
