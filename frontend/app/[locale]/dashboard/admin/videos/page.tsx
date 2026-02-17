"use client";

import { useEffect, useState } from "react";
import { Plus, Film, Eye, EyeOff, Trash2, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Video {
  id: number;
  title: string;
  category: string;
  visibility: 'public' | 'private';
  views: number;
  created_at: string;
  url: string;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const params = useParams(); // Pour gérer la locale dans les liens

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error("Erreur chargement vidéos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette vidéo définitivement ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        // Mise à jour locale de l'état pour éviter un rechargement complet
        setVideos(videos.filter(video => video.id !== id));
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur delete:", error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#002B24]">Gestion Vidéos</h1>
          <p className="text-gray-500">Administrez les contenus publics et partenaires.</p>
        </div>
        
        <Link 
          href={`/${params.locale}/dashboard/admin/videos/upload`}
          className="flex items-center gap-2 bg-[#004D40] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#00332B] transition-all shadow-lg shadow-[#004d4020]"
        >
          <Plus size={20} />
          Ajouter une vidéo
        </Link>
      </div>

      {/* Liste des Vidéos */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">Vidéo</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">Catégorie</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">Visibilité</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest">Vues</th>
              <th className="p-6 text-xs font-black uppercase text-gray-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-32 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-gray-400 font-medium">Chargement de votre bibliothèque...</p>
                  </div>
                </td>
              </tr>
            ) : videos.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-32 text-center text-gray-400">
                  <Film size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="font-bold text-secondary">Aucune vidéo trouvée.</p>
                  <p className="text-sm">Commencez par ajouter votre premier contenu.</p>
                </td>
              </tr>
            ) : (
              videos.map((video) => (
                <tr key={video.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-12 bg-secondary rounded-xl overflow-hidden relative shadow-sm">
                        {/* Petit aperçu réel de la vidéo */}
                        <video 
                          src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${video.url}`} 
                          className="object-cover w-full h-full opacity-80"
                        />
                      </div>
                      <span className="font-bold text-[#002B24] group-hover:text-primary transition-colors">
                        {video.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-gray-600">
                    <span className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-500">
                      {video.category}
                    </span>
                  </td>
                  <td className="p-6">
                    {video.visibility === 'public' ? (
                      <span className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-lg w-fit">
                        <Eye size={14} /> Public
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-lg w-fit">
                        <EyeOff size={14} /> Privé
                      </span>
                    )}
                  </td>
                  <td className="p-6 text-sm font-bold text-secondary/60">
                    {video.views.toLocaleString()} vues
                  </td>
                  <td className="p-6">
                    <div className="flex items-center justify-end gap-3">
                      <Link 
                        href={`/${params.locale}/video/${video.id}`}
                        className="p-3 hover:bg-white rounded-2xl border border-transparent hover:border-gray-100 text-gray-400 hover:text-primary transition-all shadow-hover"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(video.id)}
                        className="p-3 hover:bg-red-50 rounded-2xl text-gray-400 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}