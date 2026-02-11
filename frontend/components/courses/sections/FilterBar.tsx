"use client";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function FilterBar({
  active,
  setActive,
  searchQuery,
  setSearchQuery,
  totalResults,
}: any) {
  const CATEGORIES = ["Tous", "Management", "Digital", "Terrain", "Eco"];

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:w-2/5 group">
          <div className="absolute inset-0 bg-[#004D40]/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
          <div className="relative flex items-center bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#004D40]/20 transition-all">
            <Search className="ml-5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher une formation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-4 bg-transparent outline-none text-sm font-bold text-[#004D40] placeholder:text-gray-300"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <p className="hidden md:block text-[10px] font-black uppercase tracking-widest text-gray-400">
            {totalResults} Formations trouvées
          </p>
          <div className="flex items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
            <SlidersHorizontal size={18} className="ml-2 text-[#004D40]" />
            <select className="bg-transparent text-xs font-black text-[#004D40] outline-none pr-4 py-2 uppercase tracking-tighter cursor-pointer">
              <option>Popularité</option>
              <option>Prix croissant</option>
              <option>Mieux notés</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className="relative px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all overflow-hidden"
          >
            {active === cat && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-[#004D40] shadow-lg shadow-emerald-900/20"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${active === cat ? "text-white" : "text-gray-400 hover:text-[#004D40]"}`}
            >
              {cat}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
