"use client";
import { Camera, Check, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function ProfileForm() {
  const inputStyle =
    "w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-all";

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-50">
      <h2 className="text-2xl font-bold text-[#002B24] mb-10">
        Informations personnelles
      </h2>

      <div className="mb-12">
        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">
          Photo de profil
        </p>
        <div className="flex items-center gap-8">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <Image
              src="/temoignage.png"
              alt="Avatar"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-3">
            <button className="flex items-center gap-2 bg-[#004D40] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all active:scale-95">
              <Camera size={18} />
              Changer la photo
            </button>
            <p className="text-[11px] text-gray-400 font-medium ml-1">
              JPG, PNG ou GIF. Max 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {[
          { label: "Nom complet", value: "Marc Dubois", type: "text" },
          { label: "Email", value: "marc.dubois@email.com", type: "email" },
          { label: "Téléphone", value: "+33 6 12 34 56 78", type: "tel" },
          { label: "Ville", value: "Paris", type: "text" },
        ].map((f) => (
          <div key={f.label} className="space-y-3">
            <label className="text-xs font-black text-[#002B24] ml-1 uppercase tracking-tighter opacity-60">
              {f.label}
            </label>
            <input
              type={f.type}
              defaultValue={f.value}
              className={inputStyle}
            />
          </div>
        ))}

        {["Pays", "Langue préférée"].map((label) => (
          <div key={label} className="space-y-3 relative">
            <label className="text-xs font-black text-[#002B24] ml-1 uppercase tracking-tighter opacity-60">
              {label}
            </label>
            <div className="relative">
              <select
                className={`${inputStyle} appearance-none cursor-pointer`}
              >
                <option>{label === "Pays" ? "France" : "Français"}</option>
                <option>
                  {label === "Pays" ? "Côte d'Ivoire" : "Anglais"}
                </option>
              </select>
              <ChevronDown
                className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-end">
        <button className="bg-[#004D40] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all">
          <Check size={20} />
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
}
