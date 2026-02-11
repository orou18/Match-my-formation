"use client";
import { Video, MessageCircle, Download } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Sessions vidéo en direct",
      desc: "Interagissez avec vos formateurs.",
      icon: Video,
      bg: "bg-blue-50",
    },
    {
      title: "Chat intégré par cours",
      desc: "Discutez avec votre communauté.",
      icon: MessageCircle,
      bg: "bg-yellow-50",
    },
    {
      title: "Ressources téléchargeables",
      desc: "Accédez à vos PDF et exercices.",
      icon: Download,
      bg: "bg-green-50",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-[#004D40] mb-12">
          Fonctionnalités Innovantes
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`${f.bg} p-8 rounded-3xl text-center flex flex-col items-center`}
            >
              <div className="bg-[#004D40] text-white p-4 rounded-full mb-4">
                <f.icon size={24} />
              </div>
              <h4 className="font-bold text-[#004D40] mb-2">{f.title}</h4>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
