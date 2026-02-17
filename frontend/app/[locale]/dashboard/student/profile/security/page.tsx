"use client";
import { ShieldCheck, Lock, Smartphone, ChevronRight } from "lucide-react";

export default function SecurityPage() {
  const cardStyle = "bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all";
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-[#002B24]">Sécurité</h1>

      {/* Changement de mot de passe */}
      <div className={cardStyle}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Lock size={24} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#002B24]">Mot de passe</h3>
            <p className="text-sm text-gray-400">Dernière modification il y a 3 mois</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="password" placeholder="Mot de passe actuel" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
          <input type="password" placeholder="Nouveau mot de passe" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
        </div>
        <button className="mt-6 text-sm font-black text-primary hover:underline italic">Mot de passe oublié ?</button>
      </div>

      {/* Double Authentification (2FA) */}
      <div className={cardStyle}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
              <Smartphone size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#002B24]">Authentification à deux facteurs</h3>
              <p className="text-sm text-gray-400">Ajoutez une couche de sécurité supplémentaire</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Désactivé</span>
            <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}