"use client";

import { ShieldCheck, Lock, Smartphone, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function SecurityPage() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const cardStyle = "bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all";
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement password change API call
    setTimeout(() => {
      setLoading(false);
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }, 1000);
  };

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
        
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              type="password" 
              placeholder="Mot de passe actuel"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              required
            />
            <input 
              type="password" 
              placeholder="Nouveau mot de passe"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
              required
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </form>
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
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {twoFactorEnabled ? "Activé" : "Désactivé"}
            </span>
            <button
              onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className={`w-12 h-6 rounded-full relative transition-colors ${
                twoFactorEnabled ? "bg-primary" : "bg-gray-200"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                twoFactorEnabled ? "right-1" : "left-1"
              }`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}