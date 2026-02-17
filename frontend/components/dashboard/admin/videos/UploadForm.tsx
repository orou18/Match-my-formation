"use client";
import { useState } from "react";
import { Upload, Eye, EyeOff, Film, CheckCircle } from "lucide-react";

export default function UploadForm() {
  const [isPublic, setIsPublic] = useState(false);

  return (
    <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-4 bg-primary/10 text-primary rounded-2xl">
          <Film size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-[#002B24]">Ajouter une nouvelle vidéo</h2>
          <p className="text-sm text-gray-400">Publiez du contenu pour vos élèves ou pour toute la plateforme.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Zone Upload */}
        <div className="border-2 border-dashed border-gray-200 rounded-[2rem] p-12 flex flex-col items-center justify-center group hover:border-primary/50 transition-all cursor-pointer bg-gray-50/50">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
            <Upload className="text-primary" size={32} />
          </div>
          <p className="mt-6 font-bold text-[#002B24]">Glissez votre vidéo ici</p>
          <p className="text-xs text-gray-400 mt-2">MP4, WebM ou MKV (Max. 500MB)</p>
          <button className="mt-8 px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm">
            Parcourir les fichiers
          </button>
        </div>

        {/* Détails */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Titre de la vidéo</label>
            <input type="text" placeholder="Ex: Introduction au Design" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Catégorie</label>
                <select className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none">
                    <option>Tourisme</option>
                    <option>Hôtellerie</option>
                    <option>Management</option>
                </select>
             </div>
             <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Visibilité</label>
                <div className="flex p-1 bg-gray-50 rounded-2xl">
                    <button 
                        onClick={() => setIsPublic(false)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${!isPublic ? 'bg-white shadow-sm text-[#002B24]' : 'text-gray-400'}`}>
                        <EyeOff size={14} /> Privé
                    </button>
                    <button 
                        onClick={() => setIsPublic(true)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${isPublic ? 'bg-[#004D40] text-white shadow-md' : 'text-gray-400'}`}>
                        <Eye size={14} /> Public
                    </button>
                </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Description</label>
            <textarea rows={4} className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" placeholder="Décrivez le contenu..."></textarea>
          </div>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
        <button className="bg-[#004D40] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:-translate-y-1 transition-all">
          <CheckCircle size={20} />
          Publier la vidéo
        </button>
      </div>
    </div>
  );
}