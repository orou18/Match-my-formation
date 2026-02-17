"use client";
import { BellRing, Mail, MessageSquare, Megaphone } from "lucide-react";

export default function NotificationsPage() {
  const options = [
    { title: "Alertes de cours", desc: "Recevoir des rappels pour vos leçons", icon: BellRing, default: true },
    { title: "Emails marketing", desc: "Nouveautés et offres spéciales", icon: Mail, default: false },
    { title: "Messages directs", desc: "Notifications de vos instructeurs", icon: MessageSquare, default: true },
    { title: "Annonces plateforme", desc: "Mises à jour importantes du système", icon: Megaphone, default: true },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-black text-[#002B24]">Notifications</h1>
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm space-y-8">
        {options.map((opt, i) => (
          <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-gray-50 text-[#004D40] rounded-2xl">
                <opt.icon size={22} />
              </div>
              <div>
                <h4 className="font-bold text-[#002B24]">{opt.title}</h4>
                <p className="text-sm text-gray-400">{opt.desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked={opt.default} className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-100 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#004D40]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}