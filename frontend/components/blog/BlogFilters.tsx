"use client";

export default function BlogFilters() {
  const filterStyle =
    "px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 outline-none focus:border-[#004D40] transition-all";

  return (
    <div className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap gap-4 items-center">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Filtrer par :
          </span>
          <select className={filterStyle}>
            <option>Toutes catégories</option>
            <option>Culture & Patrimoine</option>
            <option>Méthodes de Guidage</option>
          </select>
          <select className={filterStyle}>
            <option>Tous niveaux</option>
          </select>
          <select className={filterStyle}>
            <option>Tous auteurs</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
            Trier par :
          </span>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button className="px-4 py-2 bg-[#004D40] text-white text-xs font-bold rounded-lg shadow-lg">
              Plus récents
            </button>
            <button className="px-4 py-2 text-gray-500 text-xs font-bold rounded-lg">
              Plus populaires
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
