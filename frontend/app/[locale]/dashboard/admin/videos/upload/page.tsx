"use client";
import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation"; // Ajout de useParams pour la locale
import { Upload, CheckCircle, ArrowLeft, Loader2, Film, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function UploadVideoPage() {
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const params = useParams(); // Pour rediriger vers la bonne locale

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // 1. On force la valeur de visibility pour correspondre à l'enum Laravel (public/private)
    formData.set("visibility", isPublic ? "public" : "private");

    // 2. Récupération du token pour Sanctum
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}` // On décommente car tes routes sont protégées maintenant
        }
      });

      if (response.ok) {
        // Redirection vers la liste des vidéos
        router.push(`/${params.locale}/dashboard/admin/videos`);
      } else {
        const err = await response.json();
        // Affichage des erreurs de validation Laravel s'il y en a
        alert("Erreur : " + (err.message || "Vérifiez les champs du formulaire"));
      }
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur réseau. Vérifiez que le backend Laravel est lancé.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link href={`/${params.locale}/dashboard/admin/videos`} className="group flex items-center gap-2 text-gray-500 hover:text-[#004D40] transition-colors font-bold">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Retour à la vidéothèque
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-50">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-[#004D40]/10 text-[#004D40] rounded-2xl">
            <Film size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#002B24]">Publier un nouveau média</h2>
            <p className="text-sm text-gray-400">Remplissez les détails et choisissez votre fichier vidéo.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Zone Upload */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Fichier vidéo</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center group hover:border-[#004D40]/50 transition-all cursor-pointer bg-gray-50/50 min-h-[350px]"
            >
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="text-[#004D40]" size={32} />
              </div>
              
              <div className="text-center mt-6">
                <p className="font-bold text-[#002B24]">
                  {fileName ? fileName : "Glissez votre vidéo ici"}
                </p>
                <p className="text-xs text-gray-400 mt-2">MP4, WebM ou MOV (Max. 500MB)</p>
              </div>

              {/* ATTENTION : Le nom doit être "video" pour correspondre à mon contrôleur mis à jour */}
              <input 
                ref={fileInputRef}
                name="video" 
                type="file" 
                accept="video/*" 
                className="hidden" 
                required 
                onChange={handleFileChange}
              />
              
              <button type="button" className="mt-8 px-8 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold shadow-sm group-hover:bg-gray-100">
                Parcourir les fichiers
              </button>
            </div>
          </div>

          {/* Détails */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Titre de la vidéo</label>
              <input 
                name="title"
                required
                type="text" 
                placeholder="Ex: Introduction au Design" 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#004D40]/20 transition-all text-[#002B24] font-medium" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Catégorie</label>
                  <select name="category" className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none appearance-none cursor-pointer font-medium text-[#002B24]">
                      <option value="Tourisme">Tourisme</option>
                      <option value="Hôtellerie">Hôtellerie</option>
                      <option value="Management">Management</option>
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Visibilité</label>
                  <div className="flex p-1 bg-gray-50 rounded-2xl">
                      <button 
                          type="button"
                          onClick={() => setIsPublic(false)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${!isPublic ? 'bg-white shadow-sm text-[#002B24]' : 'text-gray-400'}`}>
                          <EyeOff size={14} /> Privé
                      </button>
                      <button 
                          type="button"
                          onClick={() => setIsPublic(true)}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${isPublic ? 'bg-[#004D40] text-white shadow-md' : 'text-gray-400'}`}>
                          <Eye size={14} /> Public
                      </button>
                  </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Description</label>
              <textarea 
                name="description"
                rows={5} 
                className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-[#004D40]/20 transition-all text-[#002B24]" 
                placeholder="Décrivez brièvement le contenu de la vidéo..."
              ></textarea>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-50 flex justify-end">
          <button 
            disabled={loading}
            type="submit"
            className="bg-[#004D40] text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Publication en cours...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Lancer la publication
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}