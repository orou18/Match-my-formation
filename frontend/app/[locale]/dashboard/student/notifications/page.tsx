"use client";
import { motion } from "framer-motion";
import { Bell, Check, Trash2, Info } from "lucide-react";

const NOTIFS = [
  {
    id: 1,
    title: "Nouveau module disponible",
    desc: "Le module 'Art du Guidage' est maintenant en ligne.",
    time: "Il y a 2h",
    type: "info",
  },
  {
    id: 2,
    title: "Félicitations Marie !",
    desc: "Vous avez complété 50% de votre parcours.",
    time: "Hier",
    type: "success",
  },
  {
    id: 3,
    title: "Abonnement",
    desc: "Votre facture de Février est disponible.",
    time: "Il y a 3 jours",
    type: "billing",
  },
];

export default function NotificationsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F8FAFB]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto px-4"
      >
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#002B24] tracking-tight">
              Centre de notifications
            </h1>
            <p className="text-gray-500 font-medium">
              Restez informé de vos progrès et des nouveautés.
            </p>
          </div>
          <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
            Tout marquer comme lu
          </button>
        </div>

        <div className="space-y-4">
          {NOTIFS.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-start gap-5"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                <Bell size={20} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-[#002B24]">{n.title}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {n.time}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{n.desc}</p>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-green-50 text-green-600 rounded-lg">
                  <Check size={18} />
                </button>
                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
