export default function CategoryFilters() {
  return (
    <div className="flex items-center gap-4">
      <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm">
        <span>Filtres</span>
      </button>
      <select className="bg-white border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm outline-none">
        <option>Plus récentes</option>
        <option>Mieux notées</option>
      </select>
    </div>
  );
}